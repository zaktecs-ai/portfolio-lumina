#!/bin/bash
# Restart the Lumina portfolio preview server on :4111 cleanly.
set -u
PORT=4111
ROOT=/home/ubuntu/hermes-work/portfolio-lumina

PID=$(ss -tlnp 2>/dev/null | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | head -1)
if [ -n "${PID:-}" ]; then kill -9 "$PID" 2>/dev/null; fi
sleep 1

cd "$ROOT" || exit 1
if [ "${1:-}" = "--build" ]; then
  npx next build 2>&1 | tail -8 || exit 1
fi

setsid nohup npx next start -p "$PORT" -H 0.0.0.0 > /tmp/lumina.log 2>&1 &
for i in $(seq 1 30); do
  if curl -sf -o /dev/null "http://127.0.0.1:$PORT/"; then
    echo "up http://127.0.0.1:$PORT"
    exit 0
  fi
  sleep 1
done
echo "FAILED to start"; tail -20 /tmp/lumina.log; exit 1
