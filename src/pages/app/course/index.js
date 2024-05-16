import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {PATH_APP} from '../../../routes/paths';

export default function UserIndex() {
    const { pathname, push } = useRouter();

    useEffect(() => {
        if (pathname === PATH_APP.course.root) {
            push(PATH_APP.course.all);
        }
    }, [pathname]);

    return null;
}
