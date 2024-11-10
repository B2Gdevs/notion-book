# Use an official Python runtime as a parent image
FROM python:3.10

# The environment variable ensures that the python output is sent straight
# to terminal without being first buffered and that you can see the output of
# your application (e.g. logs) in real time.
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container to /app
WORKDIR /app

# Copy the entire codebase into the container at /app
# This includes pyproject.toml, requirements.txt, and the colorfull directory
COPY . /app/

# Check if the directory exists and is not a git clone, then handle accordingly
# This is a precaution to avoid the error when installing a package in editable mode from a git repo
RUN if [ -d "/app/src/iterative" ] && [ ! -d "/app/src/iterative/.git" ]; then \
    echo "The /app/src/iterative directory exists but is not a git clone. Removing it to proceed with clean installation."; \
    rm -rf /app/src/iterative; \
    fi

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000
EXPOSE 8080

# Set the working directory to the FastAPI application
WORKDIR /app/colorfull

# Run the application
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
