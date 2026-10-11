'use client';
import { useState, useEffect, useRef } from "react";
import { drawElement, drawText } from './app'
import { ZoomableSvg } from "@/components/ZoomableSvg";
import { X, SlidersHorizontal } from "lucide-react";

// Shared form styles: 16px text on mobile stops iOS zooming on focus; 44px controls meet touch-target guidance
// Stable reference so ZoomableSvg doesn't re-init (and reset zoom/pan) on every render
const zoomConfig = { minScale: .5, maxScale: 2 };

const fieldRow = 'flex justify-between items-center gap-4 w-full relative';
const fieldLabel = 'text-base md:text-sm text-secondary font-semibold';
const fieldControl = 'h-11 md:h-9 w-28 md:w-24 rounded-md border border-tertiary bg-white text-secondary text-base md:text-sm text-end px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary';


export default function Home() {
  // Cantilever Variables
  const [columnHeight, setColumnHeight] = useState(144);
  const [armLength, setArmLength] = useState(36);
  const [armCount, setArmCount] = useState(3);
  const [baseHeight, setBaseHeight] = useState(10) // sometimes 8 for used
  const [armClearance, setArmClearance] = useState(30);
  const [armClearanceUniform, setArmClearanceUniform] = useState(true);
  const [armClearanceArr, setArmClearanceArr] = useState<any[]>(Array(armCount).fill( Math.floor( (columnHeight-baseHeight) / (armCount+1) ) ));
  const [armHeight, setArmHeight] = useState(4); // sometimes 5 for heavy duty
  

  // Pallet Rack Variables
  const [frameHeight, setFrameHeight] = useState(144);
  const [beamLength, setBeamLength] = useState(96);
  const [beamHeight, setBeamHeight] = useState(4);
  const [beamCount, setBeamCount] = useState(2);
  const [beamClearance, setBeamClearance] = useState(54);
  const [beamClearanceUniform, setBeamClearanceUniform] = useState(true);
  const [beamClearanceArr, setBeamClearanceArr] = useState<any[]>(Array(beamCount).fill( Math.floor( (frameHeight) / (beamCount+1) ) ));

  // App Variables
  const [selectedRack, setSelectedRack] = useState<"Cantilever Rack" | "Pallet Rack">("Pallet Rack");
  const [formOpen, setFormOpen] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openForm = () => {
    setFormOpen(true);
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  };

  const closeForm = () => {
    setFormOpen(false);
    requestAnimationFrame(() => editButtonRef.current?.focus());
  };

  // Cantilever Rack DrawFunc
  useEffect(() => {
    const svgContainer = document.getElementById('cantiCol');
    if(svgContainer === null) return;
    svgContainer.innerHTML = '';

    if(selectedRack === 'Pallet Rack') return;

    // Column
    drawElement("cantiCol", '0', '20', '10', columnHeight, 0, "#00421E");

    // Base
    drawElement("cantiCol", '10', '20', armLength, baseHeight, 0, "#00421E");

    // DimensionLine - ColumnHeight
    drawElement('cantiCol', '-13', '20', 12, '1', '0', '#ADADAD');
    drawElement('cantiCol', '-13', `${19+columnHeight}`, 12, '1', '0', '#ADADAD');
    drawElement('cantiCol', '-10', '20', 1, columnHeight, '0', '#ADADAD');

    // DimensionText - ColumnHeight
    drawText('cantiCol', `${columnHeight}"`, '-13', `-${20 + columnHeight/2}`, '#ADADAD', '8px', 'end');

    if(armClearanceUniform) {
      for(var i = 1; i <= armCount; i++) {
          // Arm
          drawElement("cantiCol", '10', `${20+baseHeight-armHeight + i*(armClearance+armHeight)}`, armLength, armHeight, '4', '#Eb5a28' );

          // ArmBrace
          drawElement('cantiCol', '10', `${20+baseHeight-armHeight + i*(armClearance+armHeight) - 2}`, 1, 10, '0', '#eb5a28' );

          // DimensionLine - Arms
          drawElement('cantiCol', '11', `${20+baseHeight + (armClearance+armHeight)*(i-1)}`, armLength*1.3, '1', '0', '#ADADAD');
          drawElement('cantiCol', '11', `${20+baseHeight-armHeight + (i * (armClearance + armHeight))}`, armLength*1.3, '1', '0', '#ADADAD');
          drawElement('cantiCol', `${8 + armLength*1.3}`, `${20+baseHeight + (i-1)*(armClearance+armHeight)}`, 1, armClearance, '0', '#ADADAD');

          // DimensionText - Arms
          drawText('cantiCol', `${armClearance}"`, `${8 + armLength*1.4}`, `-${20+baseHeight + (i-1)*(armClearance+armHeight) + armClearance/2}`, '#ADADAD', '8px');
      }

      if(columnHeight-baseHeight - armCount*(armClearance+armHeight) > 0) {
        // DimensionLine - TopClear
        drawElement('cantiCol', '11', `${20+baseHeight + (armClearance+armHeight)*(i-1)}`, armLength*1.3, '1', '0', '#ADADAD');
        drawElement('cantiCol', '11', `${19+columnHeight}`, armLength*1.3, '1', '0', '#ADADAD');
        drawElement('cantiCol', `${8 + armLength*1.3}`, `${20+baseHeight + (i-1)*(armClearance+armHeight)}`, 1, `${columnHeight-baseHeight - armCount*(armClearance+armHeight)}`, '0', '#ADADAD');

        // DimensionText - TopClear
        drawText('cantiCol', `${columnHeight-baseHeight - armCount*(armClearance+armHeight)}"`, `${8 + armLength*1.4}`, `-${20+baseHeight + (i-1)*(armClearance+armHeight) + (columnHeight-baseHeight - armCount*(armClearance+armHeight))/2}`, '#ADADAD', '8px');
      }
    } else {
      armClearanceArr.forEach((value: number, index: number) => {
        let previousValuesSum = 0;
        let current = index
        while( current >= 0) {
          previousValuesSum += armClearanceArr[current];
          current--;
        }
        previousValuesSum += index*armHeight+baseHeight;

        // Arm
        drawElement('cantiCol', '10', `${20 + ((previousValuesSum))}`, armLength, armHeight, '4', '#Eb5a28');

        // Arm Clips
        drawElement('cantiCol', '10', `${20 + previousValuesSum - 2}`, 1, 10, '0', '#eb5a28' );

        // DimensionLine - Arms
        drawElement('cantiCol', '11', `${20 + (previousValuesSum)}`, armLength*1.3, '1', '0', '#ADADAD');
        drawElement('cantiCol', '11', `${20 + (previousValuesSum - value)}`, armLength*1.3, '1', '0', '#ADADAD');
        drawElement('cantiCol', `${8 + armLength*1.3}`, `${20 + (previousValuesSum - value)}`, 1, value, '0', '#ADADAD');

        // DimensionText - Arms
        drawText('cantiCol', `${value}"`, `${8 + armLength*1.4}`, `-${20 + (previousValuesSum - value) + value/2}`, '#ADADAD', '8px');


        if(index === armCount - 1)
          if(columnHeight - previousValuesSum-armHeight-2 > 0) {
          // DimensionLine - TopClear
          drawElement('cantiCol', '11', `${20 + previousValuesSum + armHeight}`, armLength*1.3, '1', '0', '#ADADAD'); // bottom line
          drawElement('cantiCol', '11', `${19+columnHeight}`, armLength*1.3, '1', '0', '#ADADAD'); // top line
          drawElement('cantiCol', `${8 + armLength*1.3}`, `${20 + previousValuesSum + armHeight}`, 1, `${columnHeight - previousValuesSum - armHeight}`, '0', '#ADADAD'); // vertical line

          // DimensionText - TopClear
          drawText('cantiCol', `${columnHeight - previousValuesSum - armHeight}"`, `${8 + armLength*1.4}`, `-${20 + previousValuesSum  + (baseHeight+columnHeight - armHeight - previousValuesSum)/2}`, '#ADADAD', '8px');
      }
      });



    }
  }, [columnHeight, armCount, armClearance, armLength, armHeight, baseHeight, selectedRack, armClearanceArr, armClearanceUniform] );

   // Pallet Rack DrawFunc
  useEffect(() => {
    const svgContainer = document.getElementById('cantiCol');
    if(selectedRack === 'Cantilever Rack') return;
    if(svgContainer === null) return;
    svgContainer.innerHTML = '';

    // Frame Columns
    drawElement("cantiCol", '5', '20', '3', frameHeight, 0, "#00421E");
    drawElement("cantiCol", `${8+beamLength}`, '20', '3', frameHeight, 0, "#00421E");

    // Frame Footplates
    drawElement("cantiCol", '2.5', '20', '8', '1', 0, "#3c3c3c");
    drawElement("cantiCol", `${5.5+beamLength}`, '20', '8', '1', 0, "#3c3c3c");

    // DimensionLine - FrameHeight
    drawElement('cantiCol', '-11', '20', 12, '1', '0', '#ADADAD');
    drawElement('cantiCol', '-11', `${19+frameHeight}`, 12, '1', '0', '#ADADAD');
    drawElement('cantiCol', '-8', '20', 1, frameHeight, '0', '#ADADAD');

    // DimensionText - FrameHeight
    drawText('cantiCol', `${frameHeight}"`, '-11', `-${20 + frameHeight/2}`, '#ADADAD', '8px', 'end');

    if(beamClearanceUniform){
      for(var i = 1; i <= beamCount; i++) {
        // Beam 
        drawElement('cantiCol', '8', `${20+beamClearance + ((i-1)*(beamClearance+beamHeight))}`, beamLength, beamHeight, 0, '#Eb5a28');

        // Beam Clips
        drawElement('cantiCol', '6.5', `${20-0.3*beamHeight+beamClearance + ((i-1)*(beamClearance+beamHeight))}`, 1.5, beamHeight*1.3, 0, '#Eb5a28');
        drawElement('cantiCol', `${8+beamLength}`, `${20-0.3*beamHeight+beamClearance + ((i-1)*(beamClearance+beamHeight))}`, 1.5, beamHeight*1.3, 0, '#Eb5a28');

        // DimensionLine - Beams Clearance
          drawElement('cantiCol', `${beamLength+12}`, `${20 + (beamClearance+beamHeight)*(i-1)}`, 12, '1', '0', '#ADADAD');
          drawElement('cantiCol', `${beamLength+12}`, `${20 + (i * (beamClearance + beamHeight))-beamHeight}`, 12, '1', '0', '#ADADAD');
          drawElement('cantiCol', `${8 + beamLength + 12}`, `${20 + (i-1)*(beamClearance+beamHeight)}`, 1, beamClearance, '0', '#ADADAD');

          // DimensionText - Beams Clearance
          drawText('cantiCol', `${beamClearance}"`, `${8 + beamLength + 16}`, `-${20 + (i-1)*(beamClearance+beamHeight) + beamClearance/2}`, '#ADADAD', '8px');
      }
    } else {
      beamClearanceArr.forEach((value: number, index: number) => {
        let previousValuesSum = 0;
        let current = index
        while( current >= 0) {
          previousValuesSum += beamClearanceArr[current];
          current--;
        }
        previousValuesSum += index*beamHeight;

        // Beam
        drawElement('cantiCol', '8', `${20 + ((previousValuesSum))}`, beamLength, beamHeight, 0, '#Eb5a28');

        // Beam Clips
        drawElement('cantiCol', '6.5', `${20-0.3*beamHeight+previousValuesSum}`, 1.5, beamHeight*1.3, 0, '#Eb5a28');
        drawElement('cantiCol', `${8+beamLength}`, `${20-0.3*beamHeight+previousValuesSum}`, 1.5, beamHeight*1.3, 0, '#Eb5a28');

        // DimensionLine - Beams Clearance
        drawElement('cantiCol', `${beamLength+12}`, `${20 + previousValuesSum}`, 12, '1', '0', '#ADADAD');
        drawElement('cantiCol', `${beamLength+12}`, `${20 + previousValuesSum - (value)}`, 12, '1', '0', '#ADADAD');
        drawElement('cantiCol', `${8 + beamLength + 12}`, `${20 + previousValuesSum - value}`, 1, value, '0', '#ADADAD');

        // DimensionText - Beams Clearance
        drawText('cantiCol', `${value}"`, `${8 + beamLength + 16}`, `-${20 + (previousValuesSum - value) + value/2}`, '#ADADAD', '8px');
        
      })
    }

    // Dimension - BeamLength
    drawElement('cantiCol', '8', `${20+frameHeight+12}`, beamLength, 1, '0', '#ADADAD');
    drawElement('cantiCol', '8', `${20+frameHeight}`, 1, 16, '0', '#ADADAD');
    drawElement('cantiCol', `${7+beamLength}`, `${20+frameHeight}`, 1, 16, '0', '#ADADAD');

    // DimensionText - BeamLength
    drawText('cantiCol', `${beamLength}"`, `${2.5 + beamLength/2}`, `-${20+frameHeight+18}`, "#ADADAD", '8px');
    
      
  }, [frameHeight, beamClearance, beamCount, beamLength, beamHeight, selectedRack, beamClearanceArr, beamClearanceUniform] );

  const updateBeamClearanceArr = (value: number, index: number) => {
    setBeamClearanceArr(prev =>
      prev.map((c, i) => (i === index ? value : c))
    );
    
  };

  const updateArmClearanceArr = (value: number, index: number) => {
    setArmClearanceArr(prev =>
      prev.map((c, i) => (i === index ? value : c))
    );
    
  };

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const syncToViewport = () => setFormOpen(mql.matches);
    syncToViewport();

    mql.addEventListener('change', syncToViewport);
    return () => mql.removeEventListener('change', syncToViewport);
  }, []);

  // Close the mobile settings panel with Escape
  useEffect(() => {
    if (!formOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !window.matchMedia('(min-width: 768px)').matches) closeForm();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [formOpen]);

  
    
  return (
    <div className="flex h-dvh overflow-hidden md:flex-row flex-col relative">
      <section
        id="Form"
        aria-label="Rack settings"
        inert={!formOpen}
        className={`z-20 h-dvh ${formOpen ? 'translate-x-0' : '-translate-x-full'} absolute inset-y-0 left-0 md:relative transition-transform ease-in-out duration-300 motion-reduce:transition-none bg-white drop-shadow-2xl md:w-120 w-full shrink-0 flex flex-col items-start px-6 md:px-8 pb-12 gap-8 overflow-y-auto overscroll-contain`}
      >
        <header className="sticky top-0 z-10 self-stretch -mx-6 md:-mx-8 px-6 md:px-8 py-3 bg-white/95 backdrop-blur border-b border-tertiary md:border-none flex items-center justify-center">
          <span className="text-xl md:text-2xl font-bold tracking-tight text-primary">RackStack</span>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close settings"
            aria-controls="Form"
            className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 size-11 inline-flex items-center justify-center rounded-full text-secondary hover:bg-tertiary/40 active:bg-tertiary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={closeForm}
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </header>

        <div role="group" aria-label="Rack type" className='flex gap-3 justify-between items-stretch w-full relative flex-nowrap *:w-full'>
              <button
                type="button"
                aria-pressed={selectedRack === 'Pallet Rack'}
                className={`flex flex-col gap-1 rounded-md border-2 p-3 min-h-11 text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selectedRack === 'Pallet Rack' ? 'border-primary ' : 'border-tertiary hover:border-secondary/40'}`}
                onClick={() => setSelectedRack('Pallet Rack')}
              >
                <span className="text-secondary font-semibold text-sm">Selective Pallet Rack</span>
                <span className="text-secondary/80 font-normal text-xs grow">Most common. Store palletized goods.</span>
              </button>

              <button
                type="button"
                aria-pressed={selectedRack === 'Cantilever Rack'}
                className={`flex flex-col gap-1 rounded-md border-2 p-3 min-h-11 text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selectedRack === 'Cantilever Rack' ? 'border-primary' : 'border-tertiary hover:border-secondary/40'}`}
                onClick={() => setSelectedRack('Cantilever Rack')}
              >
                <span className="text-secondary font-semibold text-sm">Cantilever Rack</span>
                <span className="text-secondary/80 font-normal text-xs grow">Store lumber, pipes, longer material.</span>
              </button>
        </div>

        {selectedRack === "Cantilever Rack" && 
          <div className='flex flex-col gap-6 items-center w-full'>
            <div className={fieldRow}>
              <label htmlFor="columnHeight" className={fieldLabel}>Column Height:</label>
              <select id="columnHeight" 
                className={fieldControl}
                value={columnHeight}
                onChange={(e) => setColumnHeight(Number(e.target.value))}
                >
                <option value={96}>96 in</option>
                <option value={120}>120 in</option>
                <option value={144}>144 in</option>
                <option value={192}>192 in</option>
                <option value={240}>240 in</option>
              </select> 
            </div>

            <div className={fieldRow}>
              <label htmlFor="armCount" className={fieldLabel}>Arm Count:</label>
              <select id="armCount" 
                className={fieldControl}
                value={armCount}
                onChange={(e) => {
                  const newCount = Number(e.target.value);
                  setArmCount(newCount);
                  setArmClearanceArr(prev => {
                    const next = Array(newCount).fill(Math.floor( (columnHeight-baseHeight) / (armCount+1) ));
                    for (let i = 0; i < Math.min(prev.length, newCount); i++) {
                      next[i] = prev[i];
                    }
                    return next;
                  })
                }}
                >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                
              </select>
              
              
            </div>

            <div className={fieldRow}>
              <label htmlFor="armLength" className={fieldLabel}>Arm Length:</label>
              <select id="armLength" 
                className={fieldControl}
                value={armLength}
                onChange={(e) => setArmLength(Number(e.target.value))}
                >
                <option value={36}>36 in</option>
                <option value={48}>48 in</option>
              </select> 
            </div>

            <div className={fieldRow}>
              <label htmlFor="armClearanceUniform" className={fieldLabel}>Uniform Clearance:</label>
              <input id="armClearanceUniform" 
                type='checkbox'                
                className='size-6 md:size-5 accent-primary cursor-pointer'
                checked={armClearanceUniform}
                onChange={(e) => {setArmClearanceUniform(!armClearanceUniform)}}     
              />
            </div>

            {armClearanceUniform && 
              <div className={fieldRow}>
                <label htmlFor="armClearance" className={fieldLabel}>Clearance:</label>
                <input id="armClearance" 
                  type='number'
                  min={6}
                  maxLength={3}
                  size={1}
                  inputMode='numeric'
                      className={`${fieldControl} pr-8`}
                  value={armClearance}
                  onFocus={(e) => e.target.select()}
                  onChange={(e)=> setArmClearance(Number(e.target.value))}
                />
                <span aria-hidden='true' className='pointer-events-none absolute right-3 text-secondary/70 text-base md:text-sm'>in</span>
              </div>
            }

            {!armClearanceUniform && 
              Array.from(Array(armCount), (e, i) => {
                return (
                  <div className={fieldRow} key={i}>
                    <label htmlFor={`armClearance-${i}`} className={fieldLabel}>Clearance #{i+1}:</label>
                    <input id={`armClearance-${i}`} 
                      type='number'
                      min={6}
                      maxLength={3}
                      size={1}
                      inputMode='numeric'
                      className={`${fieldControl} pr-8`}
                      value={armClearanceArr[i]}
                      onFocus={(e) => e.target.select()}
                      onChange={(e)=> updateArmClearanceArr(Number(e.target.value), i)}
                      onKeyDown={(e) => {
                        if (!/^[0-9]*$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <span aria-hidden='true' className='pointer-events-none absolute right-3 text-secondary/70 text-base md:text-sm'>in</span>
                  
                  </div>
                     
                )
              })
            }

            

            <div className='h-px bg-tertiary w-full'></div>

            <div className={fieldRow}>
              <label htmlFor="armHeight" className={fieldLabel}>Arm Height:</label>
              <select id="armHeight" 
                className={fieldControl}
                value={armHeight}
                onChange={(e) => setArmHeight(Number(e.target.value))}
                >
                <option value={4}>4 in</option>
                <option value={5}>5 in</option>
              </select> 
            </div>

            <div className={fieldRow}>
              <label htmlFor="baseHeight" className={fieldLabel}>Base Height:</label>
              <select id="baseHeight" 
                className={fieldControl}
                value={baseHeight}
                onChange={(e) => setBaseHeight(Number(e.target.value))}
              >
                <option value={10}>10 in</option>
                <option value={12}>12 in</option>
              </select>        
            </div>
            
          </div>
        } 

        {selectedRack === "Pallet Rack" && 
          <div className='flex flex-col gap-6 items-center w-full'>
            <div className={fieldRow}>
              <label htmlFor="frameHeight" className={fieldLabel}>Frame Height:</label>
              <select id="frameHeight" 
                className={fieldControl}
                value={frameHeight}
                onChange={(e) => setFrameHeight(Number(e.target.value))}
                >
                <option value={96}>96 in</option>
                <option value={120}>120 in</option>
                <option value={144}>144 in</option>
                <option value={168}>168 in</option>
                <option value={192}>192 in</option>
                <option value={216}>216 in</option>
                <option value={240}>240 in</option>
              </select> 
            </div>


            <div className={fieldRow}>
              <label htmlFor="beamCount" className={fieldLabel}>Beam Count:</label>
              <select id="beamCount" 
                className={fieldControl}
                value={beamCount}
                onChange={(e) => {
                  const newCount = Number(e.target.value);
                  setBeamCount(newCount);
                  setBeamClearanceArr(prev => {
                    const next = Array(newCount).fill(Math.floor( (frameHeight) / (beamCount+1) ));
                    for (let i = 0; i < Math.min(prev.length, newCount); i++) {
                      next[i] = prev[i];
                    }
                    return next;
                  })
                }}
                >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                
              </select>

              
              
            </div>

            <div className={fieldRow}>
              <label htmlFor="beamLength" className={fieldLabel}>Beam Length:</label>
              <select id="beamLength" 
                className={fieldControl}
                value={beamLength}
                onChange={(e) => setBeamLength(Number(e.target.value))}
                >
                <option value={48}>48 in</option>
                <option value={60}>60 in</option>
                <option value={96}>96 in</option>
                <option value={108}>108 in</option>
                <option value={120}>120 in</option>
                <option value={144}>144 in</option>
              </select> 
            </div>

            <div className={fieldRow}>
              <label htmlFor="beamClearanceUniform" className={fieldLabel}>Uniform Clearance:</label>
              <input id="beamClearanceUniform" 
                type='checkbox'                
                className='size-6 md:size-5 accent-primary cursor-pointer'
                checked={beamClearanceUniform}
                onChange={(e) => {setBeamClearanceUniform(!beamClearanceUniform)}}     
              />
            </div>

            {beamClearanceUniform && 
              <div className={fieldRow}>
                <label htmlFor="beamClearance" className={fieldLabel}>Clearance:</label>
                <input id="beamClearance" 
                  type='number'
                  maxLength={3}
                  min={4}
                  step={1}
                  size={1}
                  inputMode='numeric'
                  className={`${fieldControl} pr-8`}
                  value={beamClearance}
                  onFocus={(e) => e.target.select()}
                  onChange={(e)=> setBeamClearance(Number(e.target.value))}                  
                />
                
                <span aria-hidden='true' className='pointer-events-none absolute right-3 text-secondary/70 text-base md:text-sm'>in</span>
              </div>
            }

            {!beamClearanceUniform && 
              Array.from(Array(beamCount), (e, i) => {
                return (
                  <div className={fieldRow} key={i}>
                    <label htmlFor={`beamClearance-${i}`} className={fieldLabel}>Clearance #{i+1}:</label>
                    <input id={`beamClearance-${i}`} 
                      type='number'
                      maxLength={3}
                      min={4}
                      size={1}
                      inputMode='numeric'
                      className={`${fieldControl} pr-8`}
                      value={beamClearanceArr[i]}
                      onFocus={(e) => e.target.select()}
                      onChange={(e)=> updateBeamClearanceArr(Number(e.target.value), i)}
                      onKeyDown={(e) => {
                        if (!/^[0-9]*$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <span aria-hidden='true' className='pointer-events-none absolute right-3 text-secondary/70 text-base md:text-sm'>in</span>
                  
                  </div>
                     
                )
              })
            }

            <div className='h-px bg-tertiary w-full'></div>

            <div className={fieldRow}>
              <label htmlFor="beamHeight" className={fieldLabel}>Beam Height:</label>
              <select id="beamHeight" 
                className={fieldControl}
                value={beamHeight}
                onChange={(e) => setBeamHeight(Number(e.target.value))}
                >
                <option value={3}>3 in</option>
                <option value={4}>4 in</option>
                <option value={5}>5 in</option>
                <option value={6}>6 in</option>
              </select> 
            </div>
            
          </div>
        } 
      </section>

      {/*<section className='w-full h-screen bg-white flex items-center justify-center'>
          {/*<div className='border-t md:border-l border-tertiary md:border-t-0 relative p-12 w-full h-full md:h-screen overflow-hidden flex justify-center items-center'> */}
            <ZoomableSvg config={zoomConfig} className="bg-white w-full h-dvh md:h-screen flex justify-center items-end relative isolate p-4 touch-none">
              {/* SVG Display */}
              <svg className="w-full h-full" preserveAspectRatio="xMidYMax meet" viewBox={selectedRack === 'Cantilever Rack' ? '-32 0 132 300' : '-30 0 220 300'}>
                {/* Mirror vertically inside the SVG (y -> 300 - y) so the zoom/pan container itself stays un-flipped */}
                <g id="cantiCol" transform="translate(0 300) scale(1 -1)"></g>
              </svg>
              <div id="backgroundGrid" className="w-full h-full absolute -z-1 opacity-15"></div>
              
            </ZoomableSvg>
          {/*</div>*/}
      {/*</section>*/}

      {!formOpen &&
        <button
          ref={editButtonRef}
          type="button"
          aria-controls="Form"
          aria-expanded={formOpen}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-secondary text-white text-base font-semibold shadow-lg shadow-black/20 cursor-pointer hover:bg-secondary/90 active:scale-95 transition motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={openForm}
        >
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          Edit rack
        </button>
      }
    </div>
  );
}
