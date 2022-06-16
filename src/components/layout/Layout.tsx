import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

type LayoutProps = {
  children: React.ReactNode;
  hewwo?: boolean;
  trueFooter?: boolean;
  skipToContent?: boolean;
};

const Layout = ({ children, skipToContent = true }: LayoutProps) => {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <Header skipToContent={skipToContent} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
