import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import Button from "../ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
export default function MenuItems() {
  const { data: me } = useCurrentUser();
  const logoutMutation = useLogout();
  const user = me?.user;
  return (
    <div className="w-full">
      <div className="p-8 border-b">
        <h2 className="text-xl">
          {user?.first_name} {user?.last_name}
        </h2>
        <p className="text-text-muted">{user?.mobile}</p>
      </div>
      <ul>
        <li className="p-4 hover:bg-black/30">پروفایل</li>
        <li className="p-4 hover:bg-black/30">پشتیبانی</li>
        <li className="p-4 hover:bg-black/30">قوانین و مقررات</li>
        <li className="p-4 hover:bg-black/30">گواهینامه ها</li>
        <li className="p-4 hover:bg-black/30">درباره آیوهوش</li>
        <li className="p-4">
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {logoutMutation.isPending
              ? "در حال خروج..."
              : "خروج از حساب کاربری"}
          </Button>
        </li>{" "}
      </ul>
      <p className="text-center text-text-muted">نسخه نرم‌افزار - 1.0.0</p>
    </div>
  );
}
