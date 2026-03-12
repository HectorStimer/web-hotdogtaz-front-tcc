function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-6">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-orange-600 to-orange-800 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-gray-600 font-medium text-sm">Carregando...</p>
      </div>
    </div>
  )
}

export default LoadingScreen