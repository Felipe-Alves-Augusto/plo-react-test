import { FC } from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "../pages";
import ForgotPasswordPage from "../pages/authentication/forgot-password";
import ProfileLockPage from "../pages/authentication/profile-lock";
import ResetPasswordPage from "../pages/authentication/reset-password";
import SignInPage from "../pages/authentication/sign-in";
import SignUpPage from "../pages/authentication/sign-up";
import EcommerceBillingPage from "../pages/e-commerce/billing";
import EcommerceInvoicePage from "../pages/e-commerce/invoice";
import EcommerceProductsPage from "../pages/e-commerce/products";
import MailingComposePage from "../pages/mailing/compose";
import MailingInboxPage from "../pages/mailing/inbox";
import MailingReadPage from "../pages/mailing/read";
import MailingReplyPage from "../pages/mailing/reply";
import NotFoundPage from "../pages/pages/404";
import ServerErrorPage from "../pages/pages/500";
import MaintenancePage from "../pages/pages/maintenance";
import PricingPage from "../pages/pages/pricing";
import UserFeedPage from "../pages/users/feed";
import UserListPage from "../pages/users/list";
import UserProfilePage from "../pages/users/profile";
import UserSettingsPage from "../pages/users/settings";
import FlowbiteWrapper from "../components/flowbite-wrapper";
import Ambientes from "../pages/ambientes/Ambientes";
import ProtectedRoute from "./ProtectedRoute";
import Configuracao from "../pages/configuracao/configuracao";
import CamposPipelinePage from "../pages/configuracao/camposPipeline";
import AmbientePage from "../pages/ambiente/ambiente";
import ContactPage from "../pages/contato/contato";


const AppRoutes: FC = () => {

    return (
        <BrowserRouter>
            <Routes>

                <Route element={<FlowbiteWrapper />}>
                    <Route path="/" element={<ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>} index />

                    <Route path="/mailing/compose" element={<MailingComposePage />} />
                    <Route path="/mailing/inbox" element={<MailingInboxPage />} />
                    <Route path="/mailing/read" element={<MailingReadPage />} />
                    <Route path="/mailing/reply" element={<MailingReplyPage />} />
                    <Route path="/ambientes" element={<ProtectedRoute>
                        <Ambientes />
                    </ProtectedRoute>} />

                    <Route path="/ambiente/:environment_id" element={<ProtectedRoute>
                        <AmbientePage></AmbientePage>
                    </ProtectedRoute>}></Route>

                    <Route path="/configuracao" element={<ProtectedRoute>
                        <Configuracao></Configuracao>
                    </ProtectedRoute>}></Route>
                    <Route path="/contato" element={<ContactPage></ContactPage>}></Route>

                    <Route path="/configuracao/campos-pipeline" element={<ProtectedRoute>
                        <CamposPipelinePage></CamposPipelinePage>
                    </ProtectedRoute>}></Route>

                    <Route path="/pages/pricing" element={<PricingPage />} />
                    <Route path="/pages/maintenance" element={<MaintenancePage />} />
                    <Route path="/pages/404" element={<NotFoundPage />} />
                    <Route path="/pages/500" element={<ServerErrorPage />} />
                    <Route path="/login" element={<SignInPage />} />
                    <Route path="/authentication/sign-up" element={<SignUpPage />} />
                    <Route
                        path="/authentication/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        path="/authentication/reset-password"
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path="/authentication/profile-lock"
                        element={<ProfileLockPage />}
                    />
                    <Route
                        path="/e-commerce/billing"
                        element={<EcommerceBillingPage />}
                    />
                    <Route
                        path="/e-commerce/invoice"
                        element={<EcommerceInvoicePage />}
                    />
                    <Route
                        path="/e-commerce/products"
                        element={<EcommerceProductsPage />}
                    />
                    <Route path="/users/feed" element={<UserFeedPage />} />
                    <Route path="/users/list" element={<UserListPage />} />
                    <Route path="/users/profile" element={<UserProfilePage />} />
                    <Route path="/users/settings" element={<UserSettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )

}

export default AppRoutes;