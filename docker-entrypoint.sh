#!/bin/sh

# Replace placeholder with actual environment variable
if [ ! -z "$NEXT_PUBLIC_GRAPHQL_URI" ]; then
  echo "Setting NEXT_PUBLIC_GRAPHQL_URI to: $NEXT_PUBLIC_GRAPHQL_URI"
  sed -i "s|__NEXT_PUBLIC_GRAPHQL_URI__|$NEXT_PUBLIC_GRAPHQL_URI|g" /app/public/config.js
else
  echo "Warning: NEXT_PUBLIC_GRAPHQL_URI is not set"
fi

# Execute the original command
exec "$@" 