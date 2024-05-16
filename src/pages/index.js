import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {PATH_APP} from "../routes/paths";

export default function AppIndex() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname) {
      push(PATH_APP.root);
    }
  }, [pathname]);

  return null;
}
