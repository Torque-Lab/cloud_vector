
import http from "node:http";
http.get("http://localhost:3015/api/v1/health?health_token=12345", r => process.exit(r.statusCode === 200 ? 0 : 1));
