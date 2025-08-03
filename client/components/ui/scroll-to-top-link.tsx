import { Link, LinkProps, useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface ScrollToTopLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export function ScrollToTopLink({
  children,
  to,
  className,
  ...props
}: ScrollToTopLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Navigate to the route
    navigate(to);

    // Scroll to top after a small delay to ensure navigation completes
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
