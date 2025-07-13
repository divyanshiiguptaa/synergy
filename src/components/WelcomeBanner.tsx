import Button from './Button';

export interface WelcomeBannerProps {
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  showIcon?: boolean;
  variant?: 'default' | 'success' | 'info';
}

function WelcomeBanner({ 
  onClose, 
  title = "👋 Welcome!",
  message = "Explore city projects and EV chargers on the map.\nUse Filters to narrow results.",
  buttonText = "Get Started",
  showIcon = true,
  variant = 'default'
}: WelcomeBannerProps) {
  const variantClasses = {
    default: 'border-blue-200 text-blue-900',
    success: 'border-green-200 text-green-900',
    info: 'border-blue-200 text-blue-900'
  };

  const buttonVariants = {
    default: 'primary' as const,
    success: 'primary' as const,
    info: 'outline' as const
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className={`bg-white border px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 max-w-md w-full ${variantClasses[variant]}`}>
        <span className="text-2xl">{showIcon ? title : title.replace(/[^\w\s]/g, '')}</span>
        <span className="text-center whitespace-pre-line">
          {message}
        </span>
        <Button
          onClick={onClose}
          variant={buttonVariants[variant]}
          className="mt-2"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export default WelcomeBanner; 