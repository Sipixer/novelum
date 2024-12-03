import { HTMLAttributes } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Layout = ({ children, ...props }: LayoutProps) => {
  return (
    <div>
      <Header />
      <main {...props} className={`min-h-screen ${props.className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
