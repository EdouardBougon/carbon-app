import { selectableConnectionNames } from 'libs/wagmi/wagmi.types';
import * as v from 'valibot';

const ConnectorSchema = v.array(
  v.union(selectableConnectionNames.map((name) => v.literal(name)))
);

const AddressSchema = v.pipe(v.string(), v.regex<`0x${string}`>(/^0x(.*)$/));

export const AppConfigSchema = v.object({
  hidden: v.optional(v.boolean()),
  mode: v.union([v.literal('development'), v.literal('production')]),
  appName: v.string(),
  appUrl: v.string(),
  carbonApi: v.string(),
  externalLinks: v.optional(v.record(v.string(), v.string())),
  selectedConnectors: ConnectorSchema,
  blockedConnectors: v.optional(ConnectorSchema),
  walletConnectProjectId: v.string(),
  isSimulatorEnabled: v.boolean(),
  showStrategyRoi: v.optional(v.boolean()),
  sentryDSN: v.optional(v.string()),
  policiesLastUpdated: v.optional(v.string()),
  network: v.object({
    name: v.string(),
    logoUrl: v.string(),
    chainId: v.number(),
    rpc: v.object({
      url: v.string(),
      headers: v.optional(v.record(v.string(), v.string())),
    }),
    blockExplorer: v.object({
      name: v.string(),
      url: v.string(),
    }),
    defaultLimitedApproval: v.optional(v.boolean()),
    gasToken: v.object({
      name: v.string(),
      symbol: v.string(),
      decimals: v.number(),
      address: v.string(),
      logoURI: v.string(),
    }),
  }),
  sdk: v.object({
    cacheTTL: v.number(),
  }),
  defaultTokenPair: v.tuple([v.string(), v.string()]),
  popularPairs: v.array(v.tuple([v.string(), v.string()])),
  popularTokens: v.object({
    base: v.array(v.string()),
    quote: v.array(v.string()),
  }),
  tokenListOverride: v.array(
    v.object({
      name: v.string(),
      symbol: v.string(),
      decimals: v.number(),
      address: v.string(),
      logoURI: v.string(),
    })
  ),
  tokenLists: v.array(
    v.object({
      uri: v.string(),
      parser: v.optional(v.string()),
    })
  ),
  addresses: v.object({
    tokens: v.intersect([
      v.object({
        ZERO: v.string(),
      }),
      v.record(v.string(), v.string()),
    ]),
    carbon: v.object({
      carbonController: v.string(),
      voucher: v.string(),
    }),
  }),
  utils: v.union([
    v.object({
      multicall3: v.object({
        address: AddressSchema,
        blockCreated: v.optional(v.number()),
      }),
    }),
    v.record(
      v.string(),
      v.object({
        address: AddressSchema,
        blockCreated: v.optional(v.number()),
      })
    ),
  ]),
  tenderly: v.object({
    nativeTokenDonorAccount: v.string(),
    faucetAmount: v.number(),
    faucetTokens: v.array(
      v.object({
        decimals: v.number(),
        tokenContract: v.string(),
        donorAccount: v.string(),
        symbol: v.string(),
      })
    ),
  }),
  ui: v.object({
    priceChart: v.union([v.literal('native'), v.literal('tradingView')]),
  }),
});