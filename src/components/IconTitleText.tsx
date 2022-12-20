import { FC, ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  text?: string | ReactNode;
  variant?: 'warning';
};

export const IconTitleText: FC<Props> = ({ icon, title, text, variant }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'warning':
        return 'text-warning-500 bg-warning-500/25';
      default:
        return 'bg-black/25';
    }
  };

  const variantClass = getVariantClass();

  return (
    <div className={'flex flex-col items-center'}>
      <div
        className={`flex h-60 w-60 items-center justify-center rounded-full p-20 ${variantClass}`}
      >
        {icon}
      </div>
      <h2 className={'my-16'}>{title}</h2>
      {text && (
        <p className={'text-secondary text-center font-weight-400'}>{text}</p>
      )}
    </div>
  );
};
