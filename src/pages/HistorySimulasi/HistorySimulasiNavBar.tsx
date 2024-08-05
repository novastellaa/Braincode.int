import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import './HistorySimulasiNavBar.css'
import { FiArrowLeftCircle } from 'solid-icons/fi'
import { FiArrowRightCircle } from 'solid-icons/fi'


type HistorySimulasiNavBarProps = {};

const HistorySimulasiNavBar: Component<HistorySimulasiNavBarProps> = (props) =>  {
  const [index, setIndex] = createSignal(0);
  const [year] = createSignal(2024); 
  let carousel : any , track : any;

  const updateWidth = () => {
    const width = carousel.offsetWidth;
    track.style.transform = `translateX(${index() * -width}px)`;
  };

  const handleNext = (e : any) => {
    e.preventDefault();
    const newIndex = index() + 1;
    setIndex(newIndex);
    track.style.transform = `translateX(${newIndex * -carousel.offsetWidth}px)`;
    if (track.offsetWidth - newIndex * carousel.offsetWidth < newIndex * carousel.offsetWidth) {
      nextButton.classList.add("hide");
    }
    prevButton.classList.add("show");
  };

  const handlePrev = () => {
    const newIndex = index() - 1;
    setIndex(newIndex);
    track.style.transform = `translateX(${newIndex * -carousel.offsetWidth}px)`;
    nextButton.classList.remove("hide");
    if (newIndex === 0) {
      prevButton.classList.remove("show");
    }
  };

  let prevButton : any, nextButton : any;
  onCleanup(() => {
    window.removeEventListener("resize", updateWidth);
  });

  window.addEventListener("resize", updateWidth);

  const findCurrentDateIndex = () => {
    const currentDate = formatTanggalSekarang();
    return getAllDates(year()).findIndex(date => date.tanggal === currentDate);
  };

  onMount(() => {
    const currentDateIndex = findCurrentDateIndex();
    // console.log(currentDateIndex)
    // if (currentDateIndex !== -1) {
    //   setIndex(currentDateIndex);
    //   updateWidth();
    //   track.style.transform = `translateX(${currentDateIndex * -carousel.offsetWidth}px)`;
    //   prevButton.classList.add("show");
    // }
    // console.log("DATE -> ",getAllDates(year()));
    // console.log("formatTanggalSekarang -> ", formatTanggalSekarang());
  })

  

  return (
    <div class="carousel-container" ref={carousel}>
      <div class="inner-carousel">
        <div class="track" ref={track}>
          {getAllDates(year()).map((date, i) => (
            <>
            <Show
            when={formatTanggalSekarang() == date.tanggal}
            fallback={
              <div class="card-container"> 
              <div class='card'>
              <div>{date.hari}</div>
              <div>{date.tanggal}</div>
              </div> 
            </div>
            }
          >
             <div class="card-container"> 
              <div class='card cdfnt'>
              <div>{date.hari}</div>
              <div>{date.tanggal}</div>
              </div> 
            </div>
          </Show>
          
            </>
          ))}
        </div>
        <div class="nav">
          <button class="prev bt-arr" ref={prevButton} onClick={handlePrev}>
          <FiArrowLeftCircle />
          </button>
          <button class="next bt-arr" ref={nextButton} onClick={handleNext}>
          <FiArrowRightCircle />
          </button>
        </div>
      </div>
    </div>
  );
}


export default HistorySimulasiNavBar;

function getAllDates(year : any) {
  const dates = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  const hariDict : any = {
    0: "Minggu",
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu"
  };

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const hari = hariDict[d.getDay()];
    const tanggal = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    dates.push({ hari, tanggal });
  }

  return dates;
}

function getNamaBulan(bulan : any) {
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return namaBulan[bulan];
}

function formatTanggalSekarang() {
  const sekarang = new Date();
  const hari = sekarang.getDate();
  const bulan = getNamaBulan(sekarang.getMonth());
  const tahun = sekarang.getFullYear();
  return `${hari} ${bulan} ${tahun}`;
}