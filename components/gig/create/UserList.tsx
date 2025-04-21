import Image from "next/image";
import Modal from "./Modal";
import { User } from "lucide-react";

const UserListModal = ({
  isOpen,
  onClose,
  title,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: { name: string; email?: string; picture: string; lastname: string }[];
}) => {
  console.log(users);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="max-h-[60vh] overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-neutral-400 text-center py-4">
            No {title.toLowerCase()} found
          </p>
        ) : (
          <ul className="divide-y divide-neutral-700">
            {users.map((user, index) => (
              <li
                key={index}
                className="py-3 px-2 hover:bg-neutral-800/50 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                    {user?.picture ? (
                      <Image
                        src={user?.picture}
                        alt={user?.name[0]}
                        height={25}
                        width={25}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <User size={16} className="text-neutral-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {user.name || "Unknown User"} {user?.lastname}
                    </p>
                    {user.email && (
                      <p className="text-neutral-400 text-sm">{user.email}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};
export default UserListModal;
