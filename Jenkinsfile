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
            // lance Cypress dans un serveur X virtuel sans plugin Jenkins
            sh '''
            xvfb-run --auto-servernum \
                    --server-args="-screen 0 1280x1024x24" \
                    npx cypress run --headless
            '''
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
