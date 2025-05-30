import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imageKit = new ImageKit({
  publicKey:
    publicKey ??
    (() => {
      throw new Error("ImageKit publicKey is undefined");
    })(),
  privateKey:
    privateKey ??
    (() => {
      throw new Error("ImageKit privateKey is undefined");
    })(),
  urlEndpoint:
    urlEndpoint ??
    (() => {
      throw new Error("ImageKit urlEndpoint is undefined");
    })(),
});

export async function GET() {
  return NextResponse.json(imageKit.getAuthenticationParameters());
}
