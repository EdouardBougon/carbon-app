import { FC } from 'react';
import { useModal } from 'modals';
import { Button } from 'components/Button';

export const MainMenuRightModals: FC = () => {
  const { modals, maximizeModal } = useModal();

  return (
    <>
      {modals.minimized.map((m) => (
        <Button
          key={m.id}
          variant={'error'}
          size={'sm'}
          onClick={() => maximizeModal(m.id)}
        >
          {m.key}
        </Button>
      ))}
    </>
  );
};