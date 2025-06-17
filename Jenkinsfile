pipeline {
  agent any

  tools {
    nodejs 'Node20'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install deps') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('E2E Tests') {
      steps {
        // ici on ouvre un serveur X virtuel pour Cypress
        xvfb(displayName: 'cypress', parallelScreens: 0) {
          sh 'npx cypress run --headless'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/**', fingerprint: true
    }
  }
}
