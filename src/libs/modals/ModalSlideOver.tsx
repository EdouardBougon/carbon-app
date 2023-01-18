import { FC, ReactNode } from 'react';
import { useModal } from 'libs/modals/ModalProvider';
import { m, Variants } from 'libs/motion';
import { ReactComponent as IconX } from 'assets/icons/X.svg';

type Props = {
  children: ReactNode;
  id: string;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const getSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'lg':
      return 'max-w-[580px]';
    case 'md':
      return 'max-w-[480px]';
    default:
      return 'max-w-[380px]';
  }
};

export const ModalSlideOver: FC<Props> = ({
  children,
  id,
  title,
  size = 'sm',
  showCloseButton = true,
}) => {
  const { closeModal } = useModal();

  const sizeClass = getSize(size);

  return (
    <m.div
      onClick={() => closeModal(id)}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`fixed inset-0 z-50 flex justify-end overflow-hidden bg-primary-500/20 outline-none backdrop-blur focus:outline-none`}
    >
      <m.div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${sizeClass}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="relative flex h-screen w-full flex-col border-0 bg-silver p-25 outline-none focus:outline-none">
          <div className={'flex justify-between'}>
            <>
              {typeof title === 'string' ? (
                <h2 className={'m-0'}>{title}</h2>
              ) : (
                title
              )}
            </>
            <div>
              {showCloseButton ? (
                <button className={'p-4'} onClick={() => closeModal(id)}>
                  <IconX className={'w-12'} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="overflow-y-auto">{children}</div>
        </div>
      </m.div>
    </m.div>
  );
};

const dropIn: Variants = {
  hidden: {
    x: '100vh',
    //opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      duration: 0.5,
      // type: 'spring',
      // damping: 20,
      // mass: 1,
      // stiffness: 200,
    },
  },
  exit: {
    x: '100vh',
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.7,
    },
  },
};