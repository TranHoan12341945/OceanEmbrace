import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function Footer({ routes }) {
  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  routes: [
    { name: "Ocean Embrace", path: "https://www.facebook.com/profile.php?id=61565902633656" },
    { name: "About Us", path: "https://www.facebook.com/profile.php?id=61565902633656" },
    { name: "Blog", path: "https://www.facebook.com/profile.php?id=61565902633656" },
    { name: "License", path: "https://www.facebook.com/profile.php?id=61565902633656" },
  ],
};

Footer.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
