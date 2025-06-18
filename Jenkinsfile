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

    stage('Backend') {
  steps {
    // Positionne-toi dans ton dossier backend (ajuste le chemin si besoin)
    dir('soremed-backend') {
      // Compile et package ton backend (ici exemple Maven + Spring Boot)
      sh 'mvn clean package -DskipTests'
      // Lance-le sur le port 8080 en arrière-plan
      sh '''
        nohup java -jar target/*.jar \
          --server.port=8080 > backend.log 2>&1 &
        # Laisse le temps au serveur de démarrer
        sleep 15
      '''
    }
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
