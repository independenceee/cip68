"use client";

import React, { useEffect, useState } from "react";
import Loading from "~/app/(loading)/loading";

type Props = {
    children: React.ReactNode;
};

/**
 * A component that dynamically imports and renders the MeshProvider from @meshsdk/react.
 * It handles loading and error states to provide a smooth user experience.
 *
 * @param {Props} props - The props for the component.
 * @param {ReactNode} props.children - The children to be rendered within the MeshProvider.
 *
 * @returns {JSX.Element} - The MeshProvider component with children or fallback UI.
 */
const MeshProvider = function ({ children }: { children: React.ReactNode }): JSX.Element {
    const [MeshContext, setMeshContext] = useState<any | null>(null);
    useEffect(() => {
        (async function () {
            try {
                const { MeshProvider } = await import("@meshsdk/react");
                setMeshContext(() => MeshProvider);
            } catch (error) {
                console.error("Error importing MeshProvider:", error);
            }
        })();
    }, [setMeshContext]);

    if (MeshContext === null) {
        return <Loading />;
    }

    return <MeshContext>{children}</MeshContext>;
};

export default MeshProvider;
