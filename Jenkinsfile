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

     stage('Preview') {
      steps {
        // démarre Vite en mode preview en arrière-plan
        sh '''
          nohup npx vite preview --port 5173 > preview.log 2>&1 &
          sleep 5    # laisse le temps au serveur de démarrer
        '''
      }
    }

    stage('E2E Tests') {
      steps {
        // lance Cypress dans un serveur X virtuel
        sh '''
          xvfb-run --auto-servernum \
                   --server-args="-screen 0 1280x1024x24" \
                   npx cypress run --headless
        '''
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/**', fingerprint: true
    }
  }
}
