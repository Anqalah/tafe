import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";
import bg_home from "../../assets/logo/bg_home.jpg";

const AuthLayout = ({ children, title, type }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-bg relative overflow-hidden ">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bg_home})` }}
      />
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-card rounded-3xl shadow-2xl overflow-hidden relative animate-scale-in">
        {/* Bagian Kiri - Logo*/}
        <div className="bg-secondary p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl">
            <img
              src={Logo}
              alt="Maleo Gogakuin Palu"
              className="w-48 h-48 object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            LPK MALEO GOGAKUIN
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            PALU
          </h2>
        </div>

        {/* Bagian Kanan - Konten */}
        <div className="p-4 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">
              {type === "login"
                ? "Silakan masuk untuk melanjutkan ke sistem presensi"
                : "Daftarkan diri Anda untuk akses sistem presensi"}
            </p>
          </div>

          <div className="space-y-4">{children}</div>

          {/* Footer Links */}
          <div className="text-center space-y-3">
            {type === "login" ? (
              <div className="flex flex-col gap-3 text-center items-center pt-4">
                <Link
                  to="/forgot-password"
                  className="block text-sm text-secondary hover:text-secondary/80 transition-colors"
                >
                  Lupa Password?
                </Link>
                <p className="text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#4A5568] text-center pt-4">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#2A4365] hover:text-[#D4AF37] transition-colors"
                >
                  Masuk disini
                </Link>
              </p>
            )}

            <div className="text-center text-xs text-muted-foreground mt-8">
              © {new Date().getFullYear()} LPK MALEO GOGAKUIN. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
