# PowerShell script to create remaining features
for ($i = 57; $i -le 95; $i++) {
    $fileName = "C:\Users\Asad\CascadeProjects\nexus-web-app\components\features\feature-$i.tsx"
    if (!(Test-Path $fileName)) {
        $content = "// Feature $i : Placeholder Component`n`n'use client';`n`nconst Feature${i} : React.FC = () => {`n  return (`n    <div className='bg-gray-900 rounded-xl p-6 max-w-4xl mx-auto'>`n      <h2 className='text-3xl font-bold text-white mb-6'>Feature $i</h2>`n      <p className='text-gray-400'>This is feature number $i of 95</p>`n    </div>`n  );`n};`n`nexport default Feature${i};"
        Set-Content -Path $fileName -Value $content
    }
}
