import { useState } from "react";
import { appApiPaths } from "@/backend/apiPaths";

import { PriceCheckPayload } from "@/frontend/features/home/models/PriceCheck";
import { PriceCheckResponse, PriceCheckResults } from "@/frontend/features/hotels/models/PriceCheckResponse";

export interface UsePriceCheckResult {
    loading: boolean;
    checkPrice: (payload: PriceCheckPayload) => Promise<{ ok: boolean; data?: PriceCheckResults; error?: string }>;
}

export function usePriceCheck(): UsePriceCheckResult {
    const [loading, setLoading] = useState(false);

    const checkPrice = async (payload: PriceCheckPayload) => {
        setLoading(true);
        try {
            const res = await fetch(appApiPaths.checkPrice, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const json: PriceCheckResponse = await res.json();
            console.log("Price Check Response:", json);

            // Handle both structure types (nested in data or root if flattened, though backend says nested)
            const dataObj = json.data || (json as any);

            // Success indicators
            const hasResults = !!dataObj?.results;
            const isSuccessCode = dataObj?.code === 200;
            // Error indicators
            const isErrorFlag = dataObj?.error === true;
            const hasRootError = !!json.error;

            if (res.ok && !hasRootError && (hasResults || (isSuccessCode && !isErrorFlag))) {
                console.log("Price Check OK");
                return { ok: true, data: dataObj.results };
            } else {
                const errMsg = json.error || dataObj?.message || "Price check failed";
                console.error("Price Check Failed Logic:", res.ok, errMsg);

                return {
                    ok: false,
                    error: errMsg
                };
            }
        } catch (e) {
            return { ok: false, error: "Network error" };
        } finally {
            setLoading(false);
        }
    };

    return { loading, checkPrice };
}
