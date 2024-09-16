import { FC } from "react";
import WrapperPage from "../../components/WrapperPage";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Link } from "react-router-dom";

const ConfiguracaoPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        {/* content page here */}

        <BoxConfiguracao></BoxConfiguracao>
      </div>
    </NavbarSidebarLayout>
  );
};

const BoxConfiguracao: FC = () => {
  return (
    <>
      <WrapperPage title="Configuração">
        <div className="">
          <a
            href="/kanban"
            className="box-config flex h-[84px] transition-[0.3s] w-full max-w-[735px] items-center gap-[10px] rounded-xl border border-[#ccc] p-[16px] hover:shadow-md"
          >
            <div className="icon">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#aaa" strokeWidth="2" d="M9,18 L9,12 M12,18 L12,13 M15,18 L15,10 M17,3 L21,3 L21,23 L3,23 L3,3 L7,3 M7,1 L17,1 L17,5 L7,5 L7,1 Z"></path></svg>
            </div>
            <div className="description-config">
              <h2 className="text-[18px] title font-bold">Configurações do pipeline</h2>
              <p className="font-medium text-gray-500">Configure sua pipeline adicione, altere ou exclua</p>
            </div>
          </a>

          <Link
            to="/configuracao/campos-pipeline"
            className="box-config mt-[20px] transition-[0.3s] flex h-[84px] w-full max-w-[735px] items-center gap-[10px] rounded-xl border border-[#ccc] p-[16px] hover:shadow-md"
          >
            <div className="icon">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#aaa" strokeWidth="2" d="M9,18 L9,12 M12,18 L12,13 M15,18 L15,10 M17,3 L21,3 L21,23 L3,23 L3,3 L7,3 M7,1 L17,1 L17,5 L7,5 L7,1 Z"></path></svg>
            </div>
            <div className="description-config">
              <h2 className="text-[18px] title font-bold">Campos da Pipeline</h2>
              <p className="font-medium text-gray-500">Crie novos campos para sua pipeline!</p>
            </div>
          </Link>
        </div>
      </WrapperPage>
    </>
  );
};

export default ConfiguracaoPage;
