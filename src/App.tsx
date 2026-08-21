import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import { HomePage } from "@/features/search/HomePage";
import { SearchFlow } from "@/features/search/SearchFlow";
import { WalletPage } from "@/features/wallet/WalletPage";
import { SmartLinkPage } from "@/features/smartlink/SmartLinkPage";
import { LegalPage } from "@/features/legal/LegalPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchFlow />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/smart-link/demo" element={<SmartLinkPage />} />
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
