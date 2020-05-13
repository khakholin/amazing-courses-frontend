import React, { ComponentType, lazy, Suspense } from 'react';
import { Loader } from '../components/common/Loader/Loader';

const loadable = (
    importFunc: () => Promise<{ default: ComponentType<any> }>,
    fallback = <Loader showLoader={true} />
) => {
    //@ts-ignore
    const LazyComponent = lazy(() => {
        return Promise.all([
            importFunc(),
            new Promise(resolve => setTimeout(resolve, 1000))
        ])
            .then(([moduleExports]) => moduleExports);
    });
    return (props: any) => (
        <Suspense fallback={fallback}>
            <LazyComponent {...props} />
        </Suspense>
    );
};

export default loadable;
