import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, type }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Bagian Branding Institusi */}
        <div className="hidden md:flex md:w-2/5 bg-[#2A4365] p-10 items-center justify-center">
          <div className="text-white text-center space-y-8">
            <div className="inline-block bg-white p-8 rounded-3xl">
              <img
                src="../../../public/logo/logo.png"
                alt="Logo Institusi"
                className="w-40 h-40 object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold leading-tight text-[#D4AF37]">
              LPK MALEO GOGAKUIN
            </h2>
            <p className="text-2xl font-light text-[#F5F7FA]">PALU</p>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="md:w-3/5 p-10 flex flex-col justify-between">
          <div>
            <div className="space-y-2 mb-10">
              <h1 className="text-4xl font-bold text-[#4A5568] text-center md:text-left">
                {title}
              </h1>
              <p className="text-lg text-[#4A5568]/80 font-light text-center md:text-left">
                {type === "login"
                  ? "Silakan masuk untuk melanjutkan ke sistem presensi"
                  : "Daftarkan diri Anda untuk akses sistem presensi"}
              </p>
            </div>

            <div className="max-w-md mx-auto md:mx-0">{children}</div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-[#2A4365]/20 flex flex-col items-center">
            {type === "login" ? (
              <div className="flex flex-col gap-3 text-center items-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#2A4365] hover:text-[#D4AF37] transition-colors"
                >
                  Lupa Password?
                </Link>
                <p className="text-sm text-[#4A5568]">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-[#2A4365] hover:text-[#D4AF37] transition-colors"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#4A5568] text-center">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#2A4365] hover:text-[#D4AF37] transition-colors"
                >
                  Masuk disini
                </Link>
              </p>
            )}

            <div className="mt-6 text-center text-xs text-[#4A5568]/60">
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
