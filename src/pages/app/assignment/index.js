import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {PATH_APP} from '../../../routes/paths';

export default function AssignmentIndex() {
    const { pathname, push } = useRouter();

    useEffect(() => {
        if (pathname === PATH_APP.assignment.root) {
            push(PATH_APP.assignment.all);
        }
    }, [pathname]);

    return null;
}
