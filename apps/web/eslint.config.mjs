import nextConfig from "@shilan/config/eslint/next";

const config = [{ ignores: ["public/nagishli/**"] }, ...nextConfig];

export default config;
