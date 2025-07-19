import { DecodedJWT } from "@/types/next-auth";
import { jwtDecode } from "jwt-decode";

export function decodeJwt(token: string): DecodedJWT {
  const decoded: DecodedJWT = jwtDecode(token);
  return decoded;
}