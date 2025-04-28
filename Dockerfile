# # 1. Base image lo (Python ka light weight version)
# FROM python:3.11-slim

# # 2. Working directory set karo container ke andar
# WORKDIR /app

# # 3. Local files copy karo container ke andar
# COPY . /app

# # 4. Flask aur dusre dependencies install karo
# RUN pip install --no-cache-dir -r requirements.txt

# # 5. Expose port 5000 (jisme Flask app chalega)
# EXPOSE 5000

# # 6. Jab container run ho to app.py start karo
# CMD ["python", "app.py"]
# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
