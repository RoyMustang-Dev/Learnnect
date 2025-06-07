"""
Setup script for Learnnect Advanced AI Chatbot Backend
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="learnnect-ai-chatbot",
    version="1.0.0",
    author="Learnnect Team",
    author_email="tech@learnnect.com",
    description="Advanced AI chatbot with RAG, voice processing, and multimodal capabilities",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/learnnect/ai-chatbot",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Education",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Education",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.4.3",
            "pytest-asyncio>=0.21.1",
            "black>=23.11.0",
            "flake8>=6.1.0",
            "mypy>=1.7.0",
        ],
        "gpu": [
            "torch>=2.1.0+cu118",
            "torchaudio>=2.1.0+cu118",
        ],
    },
    entry_points={
        "console_scripts": [
            "learnnect-chatbot=main:main",
            "learnnect-setup=scripts.setup:main",
            "learnnect-migrate=scripts.migrate:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.json", "*.yaml", "*.yml", "*.txt"],
    },
)
