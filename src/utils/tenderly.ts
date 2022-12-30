import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Token__factory } from 'abis/types/factories/Token__factory';
import { lsService } from 'services/localeStorage';
import { expandToken } from 'utils/tokens';

export interface FaucetToken {
  decimals: number;
  tokenContract: string;
  donorAccount: string;
  symbol: string;
}

const tenderlyRpc = lsService.getItem('tenderlyRpc');

export const getUncheckedSigner = (user: string, rpcUrl = tenderlyRpc) =>
  new StaticJsonRpcProvider(rpcUrl).getUncheckedSigner(user);

export const ETH_DONOR_ACCOUNT = '0x00000000219ab540356cbb839cbe05303d7705fa';

export const FAUCET_TOKENS: FaucetToken[] = [
  {
    donorAccount: '0x0a59649758aa4d66e25f08dd01271e891fe52199',
    tokenContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC',
  },
  {
    donorAccount: '0x5777d92f208679db4b9778590fa3cab3ac9e2168',
    tokenContract: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    symbol: 'DAI',
  },
  {
    donorAccount: '0xa744a64dfd51e4fee3360f1ec1509d329047d7db',
    tokenContract: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    decimals: 18,
    symbol: 'BNT',
  },
  {
    donorAccount: '0x4338545408d73b0e6135876f9ff691bb72f1c8d9',
    tokenContract: '0x15b0dD2c5Db529Ab870915ff498bEa6d20Fb6b96',
    decimals: 18,
    symbol: 'PARQ',
  },
  {
    donorAccount: '0x218b95be3ed99141b0144dba6ce88807c4ad7c09',
    tokenContract: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    symbol: 'WBTC',
  },
];

const FAUCET_AMOUNT = 100;

export const tenderlyFaucetTransferETH = async (user: string) => {
  const ethSigner = getUncheckedSigner(ETH_DONOR_ACCOUNT);
  await ethSigner.sendTransaction({
    to: user,
    value: expandToken(FAUCET_AMOUNT, 18),
  });
};

export const tenderlyFaucetTransferTKN = async (
  token: FaucetToken,
  user: string
) => {
  const signer = getUncheckedSigner(token.donorAccount);
  const tokenContract = Token__factory.connect(token.tokenContract, signer);
  await tokenContract.transfer(
    user,
    expandToken(FAUCET_AMOUNT, token.decimals),
    { gasLimit: '99999999999' }
  );
};