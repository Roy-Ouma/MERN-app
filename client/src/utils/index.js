import { toast } from "sonner";



export function formatNumber (num) {
    if (num > 1000000) {
        return (num / 1000000).toFixed (1) + "M";
    } else if (num >= 1000) {
        return (num / 1000) .toFixed (1) + "K";
    }
        return num.toString ();
    }

    export const saveUserInfo = (user, signIn) => {
        localStorage.setItem(
            'userInfo',
             JSON.stringify({user: user?.user, token: user?.token})); 

        signIn({user: user?.user, token: user?.token});

        toast.success(user?.message || "Signed in successfully");

        setTimeout(() => {
            window.history.back();
        }, 1500);
    };
    


