import { useState } from "react";
import {
  LayoutGrid,
  UserCheck,
  Inbox,
  Plus,
  ClipboardPen,
  Folder,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateItemModal from "./CreateItemModal";



export default function Docker() {
  const [activeTab, setActiveTab] = useState("home");
   const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    {
      id: "board",
      name: "Board",
      icon: LayoutGrid,
    },
    {
      id: "inbox",
      name: "Inbox",
      icon: Inbox,
    },
    {
      id: "task",
      name: "My Task",
      icon: UserCheck,
    },
  ];

  return (
   <>
    <div
      className="
        fixed
        z-50

        bottom-6
        left-1/2
        -translate-x-1/2
        w-full
        px-5
        max-w-100

        md:top-2
        md:bottom-2
        md:left-2
        md:translate-x-0
        md:w-16
        md:pt-16
        md:px-0
      "
    >
      <div
        className="
          flex
          items-center
          justify-center

          rounded-2xl
          bg-linear-to-b
          from-primary
          to-primary-dark

          p-2
          shadow-lg
          shadow-primary-dark/20
          w-full

          md:h-full
          md:flex-col
          md:w-auto
          md:justify-start
        "
      >
        {/* Navigation */}
        <div
          className="
            flex
            items-center
            gap-3

            md:w-full
            md:flex-col
            md:gap-2
          "
        >
          {tabs.map(({ id, name, icon: Icon }, index) => (
            <div key={id} className="w-full">
              {/* Divider */}
              {index === 1 && (
                <div
                  className="
                    mx-2
                    mb-2
                    hidden
                    h-px
                    bg-primary-light/30
                    md:block
                  "
                />
              )}

              <button
                onClick={() => {
                  setActiveTab(id);
                  navigate(`/${id}`);
                }}
                className="
                  group
                  flex
                  w-full
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-xl
                  py-2
                  transition-all
                  duration-200
                "
              >
                {/* Icon */}
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    transition-all

                    ${
                      activeTab === id
                        ? "bg-white text-primary shadow-sm"
                        : "text-white hover:bg-primary-light/20"
                    }
                  `}
                >
                  <Icon
                    size={22}
                    strokeWidth={
                      activeTab === id ? 2.5 : 2
                    }
                  />
                </div>

                {/* Title */}
                <span
                  className={`
                    hidden
                    md:block
                    text-center
                    text-[11px]
                    font-medium
                    leading-none
                    whitespace-nowrap

                    ${
                      activeTab === id
                        ? "text-white"
                        : "text-primary-light"
                    }
                  `}
                >
                  {name}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* More */}
        <button
        onClick={()=>setOpenCreate(true)}
          className="
            md:mt-auto
            md:mr-0
            ml-auto
            mr-2

            flex
            w-fit
            md:w-full
            flex-col
            items-center
            justify-center
            gap-1
            rounded-xl
            py-2
            text-primary-light
            transition-all
            hover:bg-primary-light/20
            hover:text-white
            active:scale-95
          "
        >
          <div className="flex h-10 w-10 items-center justify-center ">
            <Plus size={24} strokeWidth={2} />
          </div>

          <span className="hidden md:block text-[11px] font-medium leading-none">
            Create
          </span>
        </button>
      </div>
    </div>

    {openCreate &&
       <CreateItemModal workspaceMembers={[]} onClose={()=>setOpenCreate(false)} onSubmitProject={()=>{}} onSubmitTask={()=>{}}/>
    }
   </>
  );
}
