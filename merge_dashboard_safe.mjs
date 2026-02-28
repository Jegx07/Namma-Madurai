import fs from 'fs';

const lines = fs.readFileSync('src/pages/user/UserDashboard.tsx', 'utf8').split('\n');

const merged = [];
let i = 0;
while (i < lines.length) {
    if (lines[i].startsWith('<<<<<<< ours')) {
        let oursStart = i + 1;
        let oursEnd = i + 1;
        while (!lines[oursEnd].startsWith('=======')) oursEnd++;

        let theirsStart = oursEnd + 1;
        let theirsEnd = theirsStart;
        while (!lines[theirsEnd].startsWith('>>>>>>> theirs')) theirsEnd++;

        const oursBlock = lines.slice(oursStart, oursEnd).join('\n');
        const theirsBlock = lines.slice(theirsStart, theirsEnd).join('\n');

        if (i === 4) {
            // Conflict 1: lines 5-78
            merged.push(oursBlock);
            merged.push(theirsBlock.replace(/import \{.*?\} from "lucide-react";\r?\n/, ''));
        } else if (i === 111) {
            // Conflict 2: Component State
            merged.push(oursBlock);
        } else if (i === 222) {
            // Conflict 3: Header and Stat 1
            merged.push(`            <h1 className="text-3xl font-light tracking-widest text-gray-900 uppercase">Dashboard</h1>
            <div className="hidden md:flex items-center gap-1.5 opacity-50">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Stat 1 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">{loading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-500" /> : myReportsCount}</div>
              <div className="flex flex-col">
                <div className="h-4 w-16 mb-0.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniBarData}>
                      <Bar dataKey="value" fill="#10b981" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Total Reports</span>`);
        } else if (i === 290) {
            // Conflict 4: Stats 2 and 3
            merged.push(`            {/* Stat 2 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">{loading ? <Loader2 className="h-6 w-6 animate-spin text-amber-500" /> : resolvedCount}</div>
              <div className="flex flex-col">
                <div className="h-4 w-16 mb-0.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniBarData}>
                      <Bar dataKey="value" fill="#f59e0b" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Resolved</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl font-medium text-gray-900 leading-none">{loading ? <Loader2 className="h-6 w-6 animate-spin text-orange-500" /> : pendingCount}</div>
              <div className="flex flex-col">
                <div className="h-4 w-16 mb-0.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniBarData}>
                      <Bar dataKey="value" fill="#ea580c" radius={[1, 1, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">In Progress</span>`);
        } else if (i === 339) {
            // Conflict 5: Clean Score Gauge
            merged.push(`              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <div className="w-24 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={44}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {gaugeData.map((entry, index) => (
                          <Cell key={\`cell-\${index}\`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-gray-500 font-medium uppercase mt-2">Score</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">{loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : \`\${cleanScore}%\`}</span>
                  </div>
                </div>
              </div>`);
        } else if (i === 407) {
            // Conflict 6: Reporting Trends
            merged.push(oursBlock);
        } else if (i === 464) {
            // Conflict 7: Map component
            merged.push(oursBlock);
        }

        i = theirsEnd + 1;
    } else {
        merged.push(lines[i]);
        i++;
    }
}

fs.writeFileSync('src/pages/user/UserDashboard.tsx', merged.join('\n'));
console.log('Merge complete!');
