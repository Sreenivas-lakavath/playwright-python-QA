FROM selenium/standalone-chrome:latest

# Install Python and pip so tests that use selenium Python bindings can run inside this image
USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Install Python dependencies from requirements.txt
COPY requirements.txt /workspace/requirements.txt
RUN pip3 install --no-cache-dir -r /workspace/requirements.txt

# Note: do NOT override the base image CMD so the Selenium server (started by the base image)
# continues to run. This image only installs Python + test tooling.
