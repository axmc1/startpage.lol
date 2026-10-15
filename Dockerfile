FROM ghcr.io/pnpm/pnpm:12.13.0@sha256:8ebb7ad694024b47535f6c2cd6bbeb532836e314609e8d90df0ef1f25661f8f4 AS base
RUN pnpm runtime set node 24 -g
COPY . /app
WORKDIR /app
RUN pnpm ci
RUN pnpm build

FROM steebchen/nginx-spa:stable@sha256:320153b55b94fe63600ac1174e7370d5c4e4ba344e0ed51f0c42e72b131595a1
COPY --from=base /app/dist /app
EXPOSE 80
CMD ["nginx"]
