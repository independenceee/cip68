"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, Suspense, useState, lazy } from "react";

const MeshProvider = lazy(() => import("~/contexts/providers/MeshProvider"));

type Props = {
    children: ReactNode;
};

/**
 * @description: Provides React Query and Mesh SDK context to the entire app.
 * @param {ReactNode} children - The components that need context providers.
 * @returns {JSX.Element} The wrapped components with context.
 */
const ContextProvider = function ({ children }: Props): JSX.Element {
    const [client] = useState(() => new QueryClient());

    return (
        <Suspense fallback={<></>}>
            <QueryClientProvider client={client}>
                <MeshProvider>{children}</MeshProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Suspense>
    );
};

export default ContextProvider;
