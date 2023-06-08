import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { useGetTokenData } from 'libs/queries/chain/token';
import { Button } from 'components/common/button';
import { useTokens } from 'hooks/useTokens';
import { useModal } from 'hooks/useModal';
import { shortenString } from 'utils/helpers';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { Link } from 'libs/routing';
import { useTranslation } from 'libs/translations';

export type ModalImportTokenData = {
  address: string;
};

export const ModalImportToken: ModalFC<ModalImportTokenData> = ({
  id,
  data: { address },
}) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { data, isLoading, isError } = useGetTokenData(address);
  const { importToken } = useTokens();

  const onClick = () => {
    if (!data) {
      return;
    }
    importToken(data);
    closeModal(id);
  };

  const blockClasses = 'my-20 h-80 rounded-8';

  return (
    <Modal id={id} title={t('modals.importToken.modalTitle')}>
      <div className={'mt-40'}>
        <IconTitleText
          variant={'warning'}
          icon={<IconWarning />}
          title={'Use at your own risk'}
          text={
            "This token doesn't appear on the active token list. Anyone can create a token, including fake versions of existing tokens that claim to represent projects."
          }
        />
      </div>

      {isLoading && (
        <div className={`${blockClasses} animate-pulse dark:bg-silver`}></div>
      )}
      {isError && (
        <div
          className={`${blockClasses} flex items-center justify-center dark:bg-red/30`}
        >
          {t('modals.importToken.content1')}
        </div>
      )}
      {data && (
        <div className={`${blockClasses} bg-silver p-16`}>
          <div className={'flex items-center justify-between'}>
            <div className={'font-weight-500'}>{data.symbol}</div>
            <Link
              to={getExplorerLink('token', data.address)}
              className={
                'flex items-center text-14 font-weight-500 text-warning-500'
              }
            >
              <span className={'whitespace-nowrap'}>
                {t('modals.importToken.content2')}
              </span>
              <IconLink className={'ml-4 inline-flex h-14'} />
            </Link>
          </div>
          <div className={'flex items-center justify-between'}>
            <div className={'text-secondary text-14'}>{data.name}</div>
            <div className={'font-mono text-14'}>
              {shortenString(data.address)}
            </div>
          </div>
        </div>
      )}
      <Button
        variant={'white'}
        fullWidth
        onClick={onClick}
        disabled={isLoading || isError}
      >
        {t('modals.importToken.actionButtons.actionButton1')}
      </Button>
      <Button
        variant={'black'}
        fullWidth
        onClick={() => closeModal(id)}
        className={'mt-16'}
      >
        {t('modals.importToken.actionButtons.actionButton2')}
      </Button>
    </Modal>
  );
};
