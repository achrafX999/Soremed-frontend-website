// Jenkinsfile
pipeline {
  agent any

  environment {
    VITE_API_BASE_URL = 'http://localhost:8080/api'
  }

  tools {
    jdk    'JDK21'
    maven  'M3'
    nodejs 'Node20'
  }

  stages {
    stage('Checkout Frontend') {
      steps {
        checkout scm
      }
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

    stage('Build Frontend') {
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

    stage('Start Front Dev Server') {
      steps {
        // On utilise le "dev server" pour profiter du proxy
        sh '''
          nohup npm run dev -- --port 5173 > dev.log 2>&1 &
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
