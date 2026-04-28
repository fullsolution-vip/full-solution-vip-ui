# Observability Stack

This directory contains Docker Compose configuration for observing the Full Solution chatbot.

## Quick Start

1. Start the observability stack:
   ```bash
   docker-compose -f docker-compose.observability.yml up -d
   ```

2. Access the dashboards:
   - **Grafana**: http://localhost:3000 (no login required)
   - **Jaeger UI**: http://localhost:16686
   - **Prometheus**: http://localhost:9090

3. View logs:
   ```bash
   tail -f logs/chatbot.log
   ```

## Services

- **OpenTelemetry Collector**: Receives traces/metrics/logs
- **Loki**: Log aggregation
- **Promtail**: Ships logs to Loki
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboard
- **Jaeger**: Distributed tracing UI

## Configuration

Configuration files are in `.docker/` directory:
- `otel-collector-config.yaml` - OpenTelemetry Collector config
- `prometheus.yml` - Prometheus scrape config
- `loki-config.yaml` - Loki config
- `promtail-config.yaml` - Promtail log shipping config
- `grafana-provisioning/` - Auto-provisioned dashboards

## Stopping

```bash
docker-compose -f docker-compose.observability.yml down
```
