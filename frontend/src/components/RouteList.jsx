const RouteList = ({ resultData }) => {
  if (!resultData || !resultData.path) return null;

  return (
    <div className="mt-8 pt-6 border-t border-dashed border-slate-200">
      <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Lộ trình chi tiết</label>
      
      <div className="mb-6 flex gap-4">
          <div className="px-3 py-1 bg-red-50 text-[#e30613] rounded-full text-xs font-bold">
            ⏱ {Math.round(resultData.total_time / 60)} phút
          </div>
      </div>

      <ul className="list-none p-0 m-0">
        {resultData.path.map((step, index) => {
          const isStart = index === 0;
          const isEnd = index === resultData.path.length - 1;
          
          return (
            <li key={index} className="relative pl-8 pb-6 text-sm">
              {/* Vạch kẻ nối các ga */}
              {!isEnd && (
                <div className={`absolute left-[4.5px] top-[14px] w-[2px] h-full z-0 ${resultData.path[index+1].is_transfer ? 'border-l-2 border-dashed border-orange-400' : 'bg-slate-200'}`}></div>
              )}
              
              {/* Nút thắt ga */}
              <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full z-10 ${step.is_transfer ? 'bg-orange-500' : 'bg-[#e30613]'}`}></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className={`font-bold ${isStart || isEnd ? 'text-slate-900' : 'text-slate-600'}`}>
                    {step.name}
                  </div>
                  
                  {/* Hiển thị thông báo đi bộ nếu ga tiếp theo là trung chuyển */}
                  {resultData.path[index+1]?.is_transfer && (
                    <div className="text-[10px] text-orange-600 font-bold mt-1 flex items-center gap-1">
                      🚶‍♂️ Đi bộ đổi tuyến ({Math.round(resultData.path[index+1].step_time / 60)} phút)
                    </div>
                  )}
                </div>

                {/* Hiển thị thời gian đến ga (Phút thứ bao nhiêu) */}
                {!isStart && (
                  <div className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                    +{Math.round(step.arrival_time / 60)}'
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RouteList;