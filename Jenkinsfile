pipeline {
  agent any

  environment {
    VITE_API_BASE_URL = 'http://localhost:8080/api'
  }

  tools {
    nodejs 'Node20'
    maven  'M3'            // ← ton installation Maven
  }

  stages {
    stage('Checkout Frontend') {
      steps { checkout scm }
    }

    stage('Checkout Backend') {
      steps {
        dir('soremed-backend') {
          checkout([
            $class: 'GitSCM',
            branches: [[ name: '*/master' ]],
            userRemoteConfigs: [[
              url: 'https://github.com/achrafX999/Soremed-backend-website',
              credentialsId: 'github-creds'
            ]]
          ])
        }
      }
    }

    stage('Build Front') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('Build Backend') {
      steps {
        dir('soremed-backend') {
          sh 'mvn clean package -DskipTests'
        }
      }
    }

    stage('Start Backend') {
      steps {
        dir('soremed-backend') {
          sh '''
            nohup java -jar target/*.jar \
              --server.port=8080 > backend.log 2>&1 &
            sleep 15
          '''
        }
      }
    }

    stage('Preview Front') {
      steps {
        sh '''
          nohup npx vite preview --port 5173 > preview.log 2>&1 &
          sleep 5
        '''
      }
    }

    stage('E2E Tests') {
      steps {
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
