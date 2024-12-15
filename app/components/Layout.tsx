import { HTMLAttributes } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Layout = ({ children, ...props }: LayoutProps) => {
  const navigation = useNavigation();
  return (
    <div>
      <Header />
      {navigation.state !== "idle" ? (
        <div className="h-screen flex items-center justify-center w-full">
          <Loader2 className="animate-spin" size="3rem" />
        </div>
      ) : (
        <main {...props} className={`min-h-screen ${props.className}`}>
          {children}
        </main>
      )}

      <Footer />
    </div>
  );
};
