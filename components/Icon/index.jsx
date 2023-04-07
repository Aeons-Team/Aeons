import { motion } from 'framer-motion'

export default function Icon({ name, fill, fillColor, width, height, strokeWidth, ...remaining }) {
    const style = fill ? {
        fill: 'var(--color-secondary)',
        stroke: 'none'
    } : {   
        stroke: 'var(--color-secondary)',
        strokeWidth: strokeWidth || 1.5,
        fill: 'none'
    }

    if (width) style.width = width 
    if (height) style.height = height

    if (fill && fillColor) style.fill = fillColor

    switch (name) {
        case 'upload-file': 
            return <motion.svg {...remaining} style={style} viewBox="0 0 23 29" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 6.97735V24.8139C22.5 26.7124 20.961 28.2514 19.0625 28.2514H3.9375C2.03902 28.2514 0.5 26.7124 0.5 24.8139V4.18888C0.5 2.2904 2.03902 0.751378 3.9375 0.751378H16.274C16.4566 0.739801 16.6466 0.800658 16.7986 0.952742L22.2986 6.45274C22.4507 6.60483 22.5116 6.79482 22.5 6.97735ZM15.625 2.12638H3.9375C2.79841 2.12638 1.875 3.04979 1.875 4.18888V24.8139C1.875 25.953 2.79841 26.8764 3.9375 26.8764H19.0625C20.2016 26.8764 21.125 25.953 21.125 24.8139V7.62638H16.3125C15.9328 7.62638 15.625 7.31857 15.625 6.93888V2.12638ZM17 3.09865V6.25138H20.1527L17 3.09865ZM11.5 12.7223V22.0625C11.5 22.4422 11.1922 22.75 10.8125 22.75C10.4328 22.75 10.125 22.4422 10.125 22.0625V12.7223L7.17364 15.6736C6.90515 15.9421 6.46985 15.9421 6.20136 15.6736C5.93288 15.4052 5.93288 14.9698 6.20136 14.7014L10.3264 10.5764C10.5948 10.3079 11.0302 10.3079 11.2986 10.5764L15.4236 14.7014C15.6921 14.9698 15.6921 15.4052 15.4236 15.6736C15.1552 15.9421 14.7198 15.9421 14.4514 15.6736L11.5 12.7223Z" />
            </motion.svg>

        case 'folder':
            return <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"/>
            </motion.svg>
        
        case 'open':
            return <motion.svg {...remaining} style={style} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 18V9C7.5 8.17158 8.17158 7.5 9 7.5H27C27.8284 7.5 28.5 8.17158 28.5 9V27C28.5 27.8284 27.8284 28.5 27 28.5H18M12.1667 18H18M18 18V23.8333M18 18L7.5 28.5" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'url': 
            return <motion.svg {...remaining} style={style} viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9934 21.0074L21.0073 12.9935M9.98872 15.9984L7.98524 18.0018C5.77228 20.2148 5.77163 23.8031 7.9846 26.0161C10.1976 28.229 13.7866 28.2283 15.9996 26.0153L18.0009 24.0122M15.9983 9.98746L18.0017 7.984C20.2147 5.77102 23.8023 5.77142 26.0152 7.98439C28.2282 10.1974 28.2281 13.7853 26.0151 15.9982L24.0126 18.0017" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'move':
            return <motion.svg {...remaining} style={style} viewBox="0 0 27 22" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.66291 0.625C9.18331 0.625 9.6875 0.798146 10.097 1.11496L10.2063 1.2049L11.8226 2.6192C11.9413 2.72304 12.088 2.78805 12.2432 2.80683L12.3371 2.8125H23.1562C24.4089 2.8125 25.432 3.79523 25.4968 5.03178L25.5 5.15625L25.5006 10.0352C25.0295 9.61353 24.5048 9.25048 23.9379 8.9576L23.9375 5.15625C23.9375 4.75174 23.6301 4.41904 23.2361 4.37903L23.1562 4.375L12.2796 4.3743L10.9503 6.0092C10.5349 6.52044 9.92517 6.83157 9.27189 6.87079L9.1313 6.875L2.0625 6.87437V17.0312C2.0625 17.4358 2.36992 17.7685 2.76387 17.8085L2.84375 17.8125L13.3241 17.8128C13.4917 18.3633 13.721 18.8869 14.0037 19.3757L2.84375 19.375C1.59109 19.375 0.567954 18.3923 0.503249 17.1557L0.5 17.0312V2.96875C0.5 1.71609 1.48273 0.692954 2.71928 0.628249L2.84375 0.625H8.66291ZM8.66291 2.1875H2.84375C2.43924 2.1875 2.10654 2.49492 2.06653 2.88887L2.0625 2.96875V5.31187L9.1313 5.3125C9.33715 5.3125 9.53341 5.23133 9.67864 5.08872L9.73764 5.0239L10.7594 3.76562L9.17737 2.3808C9.05869 2.27696 8.91196 2.21195 8.75684 2.19316L8.66291 2.1875ZM20.5 9.375C23.9518 9.375 26.75 12.1732 26.75 15.625C26.75 19.0768 23.9518 21.875 20.5 21.875C17.0482 21.875 14.25 19.0768 14.25 15.625C14.25 12.1732 17.0482 9.375 20.5 9.375ZM20.4994 12.2714L20.4294 12.3186L20.3706 12.3706L20.3186 12.4294C20.1438 12.6542 20.1438 12.9708 20.3186 13.1956L20.3706 13.2544L22.1156 15H17.375L17.3021 15.0042C17.0152 15.0375 16.7875 15.2652 16.7542 15.5521L16.75 15.625L16.7542 15.6979C16.7875 15.9848 17.0152 16.2125 17.3021 16.2458L17.375 16.25H22.1156L20.3706 17.9956L20.3186 18.0544C20.1279 18.2996 20.1453 18.6541 20.3706 18.8794C20.5959 19.1047 20.9504 19.1221 21.1956 18.9314L21.2544 18.8794L24.0669 16.0669L24.0986 16.0328L24.1435 15.9741L24.172 15.9277L24.1915 15.8895L24.2189 15.8201L24.2329 15.7709L24.2457 15.6984L24.25 15.625L24.2481 15.5775L24.2374 15.4995L24.219 15.4302L24.2055 15.3929L24.1721 15.3225L24.1435 15.2759L24.117 15.2395L24.0928 15.2105L24.0669 15.1831L21.2544 12.3706L21.1956 12.3186C20.9933 12.1613 20.7166 12.1456 20.4994 12.2714Z" />
            </motion.svg>

        case 'rename':
            return <motion.svg {...remaining} style={style} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5893 2.14282C12.1456 2.14282 11.7858 2.5026 11.7858 2.94639C11.7858 3.39019 12.1456 3.74997 12.5893 3.74997H14.1965V26.25H12.5893C12.1456 26.25 11.7858 26.6098 11.7858 27.0535C11.7858 27.4973 12.1456 27.8571 12.5893 27.8571H17.4108C17.8546 27.8571 18.2143 27.4973 18.2143 27.0535C18.2143 26.6098 17.8546 26.25 17.4108 26.25H15.8036V3.74997H17.4108C17.8546 3.74997 18.2143 3.39019 18.2143 2.94639C18.2143 2.5026 17.8546 2.14282 17.4108 2.14282H12.5893Z" />
                <path d="M6.69638 6.44958H13.1249V8.05673H6.69638C5.66084 8.05673 4.82138 8.89619 4.82138 9.93173V20.1103C4.82138 21.1459 5.66084 21.9853 6.69638 21.9853H13.1249V23.5925H6.69638C4.77324 23.5925 3.21423 22.0334 3.21423 20.1103V9.93173C3.21423 8.00859 4.77324 6.44958 6.69638 6.44958Z" />
                <path d="M23.3036 21.9853H16.875V23.5925H23.3036C25.2267 23.5925 26.7857 22.0334 26.7857 20.1103V9.93173C26.7857 8.00859 25.2267 6.44958 23.3036 6.44958H16.875V8.05673H23.3036C24.3391 8.05673 25.1786 8.89619 25.1786 9.93173V20.1103C25.1786 21.1459 24.3391 21.9853 23.3036 21.9853Z" />
            </motion.svg>

        case 'archive':
            return <motion.svg {...remaining} style={style} viewBox="0 0 262 262" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.6666 87.3332H218.333V229.25C218.333 232.145 217.183 234.922 215.136 236.969C213.089 239.016 210.312 240.167 207.417 240.167H54.5833C51.688 240.167 48.9113 239.016 46.864 236.969C44.8167 234.922 43.6666 232.145 43.6666 229.25V87.3332ZM76.4166 54.5833V32.7499C76.4166 29.8546 77.5667 27.0779 79.614 25.0307C81.6613 22.9834 84.438 21.8333 87.3332 21.8333H174.667C177.562 21.8333 180.339 22.9834 182.386 25.0307C184.433 27.0779 185.583 29.8546 185.583 32.7499V54.5833H240.167V76.4166H21.8333V54.5833H76.4166ZM98.2499 43.6666V54.5833H163.75V43.6666H98.2499ZM98.2499 131V196.5H120.083V131H98.2499ZM141.917 131V196.5H163.75V131H141.917Z" />
            </motion.svg>
            

        case 'moon':
            return <motion.svg {...remaining} style={style} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.1222 7.31969L13.903 7.29506C13.8954 7.05294 13.7759 6.82806 13.5795 6.68625C13.3831 6.54444 13.1321 6.50181 12.8998 6.57075L13.1222 7.31969ZM7.68031 1.87784L8.42925 2.10017C8.49819 1.86796 8.45556 1.61689 8.31375 1.4205C8.17194 1.22411 7.94706 1.1046 7.70494 1.09697L7.68031 1.87784ZM12.8998 6.57075C12.576 6.66687 12.2322 6.71875 11.875 6.71875V8.28125C12.3844 8.28125 12.8779 8.20712 13.3445 8.06862L12.8998 6.57075ZM11.875 6.71875C9.89025 6.71875 8.28125 5.10977 8.28125 3.125H6.71875C6.71875 5.97272 9.02731 8.28125 11.875 8.28125V6.71875ZM8.28125 3.125C8.28125 2.76776 8.33312 2.42401 8.42925 2.10017L6.93137 1.65549C6.79287 2.12214 6.71875 2.6156 6.71875 3.125H8.28125ZM7.5 2.65625C7.55212 2.65625 7.60406 2.65707 7.65575 2.6587L7.70494 1.09697C7.63687 1.09483 7.56856 1.09375 7.5 1.09375V2.65625ZM2.65625 7.5C2.65625 4.82487 4.82487 2.65625 7.5 2.65625V1.09375C3.96192 1.09375 1.09375 3.96192 1.09375 7.5H2.65625ZM7.5 12.3437C4.82487 12.3437 2.65625 10.1751 2.65625 7.5H1.09375C1.09375 11.0381 3.96192 13.9062 7.5 13.9062V12.3437ZM12.3437 7.5C12.3437 10.1751 10.1751 12.3437 7.5 12.3437V13.9062C11.0381 13.9062 13.9062 11.0381 13.9062 7.5H12.3437ZM12.3413 7.34425C12.3429 7.39594 12.3437 7.44787 12.3437 7.5H13.9062C13.9062 7.43144 13.9052 7.36312 13.903 7.29506L12.3413 7.34425Z" />
            </motion.svg>

        case 'sun':
            return <motion.svg {...remaining} style={style} viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.48965 3.69157C2.1573 3.35922 2.1573 2.82111 2.48965 2.48961C2.822 2.15726 3.36005 2.15726 3.69155 2.48961C4.0239 2.82111 4.0239 3.35922 3.69155 3.69157C3.36005 4.02392 2.822 4.02392 2.48965 3.69157ZM14.5103 13.3084C14.8427 13.6399 14.8427 14.178 14.5103 14.5104C14.1788 14.8419 13.6399 14.8419 13.3084 14.5104C12.9761 14.178 12.9761 13.6399 13.3084 13.3084C13.6399 12.9761 14.1788 12.9761 14.5103 13.3084ZM3.69155 13.3084C4.0239 13.6399 4.0239 14.178 3.69155 14.5104C3.36005 14.8419 2.822 14.8419 2.48965 14.5104C2.1573 14.178 2.1573 13.6399 2.48965 13.3084C2.822 12.9761 3.36005 12.9761 3.69155 13.3084ZM14.5103 2.48961C14.8427 2.82111 14.8427 3.35922 14.5103 3.69157C14.1788 4.02392 13.6399 4.02392 13.3084 3.69157C12.9761 3.35922 12.9761 2.82111 13.3084 2.48961C13.6399 2.15726 14.1788 2.15726 14.5103 2.48961ZM1.7 8.5C1.7 8.9692 1.3192 9.35 0.85 9.35C0.3808 9.35 0 8.9692 0 8.5C0 8.0308 0.3808 7.65 0.85 7.65C1.3192 7.65 1.7 8.0308 1.7 8.5ZM17 8.5C17 8.9692 16.6192 9.35 16.15 9.35C15.6808 9.35 15.3 8.9692 15.3 8.5C15.3 8.0308 15.6808 7.65 16.15 7.65C16.6192 7.65 17 8.0308 17 8.5ZM9.35 16.15C9.35 16.6192 8.9692 17 8.5 17C8.0308 17 7.65 16.6192 7.65 16.15C7.65 15.6808 8.0308 15.3 8.5 15.3C8.9692 15.3 9.35 15.6808 9.35 16.15ZM7.65 0.85C7.65 0.3808 8.0308 0 8.5 0C8.9692 0 9.35 0.3808 9.35 0.85C9.35 1.3192 8.9692 1.7 8.5 1.7C8.0308 1.7 7.65 1.3192 7.65 0.85ZM8.5 12.75C6.15655 12.75 4.25 10.8435 4.25 8.5C4.25 6.15655 6.15655 4.25 8.5 4.25C10.8435 4.25 12.75 6.15655 12.75 8.5C12.75 10.8435 10.8435 12.75 8.5 12.75ZM8.5 2.55C5.2139 2.55 2.55 5.2139 2.55 8.5C2.55 11.7861 5.2139 14.45 8.5 14.45C11.7861 14.45 14.45 11.7861 14.45 8.5C14.45 5.2139 11.7861 2.55 8.5 2.55Z" />
            </motion.svg>

        case 'drive':
            return <motion.svg {...remaining} style={style} viewBox="0 0 262 318" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.3334 53.0418C10.3334 41.0739 15.0876 29.5961 23.5502 21.1336C32.0128 12.671 43.4905 7.91675 55.4584 7.91675H207.542C219.51 7.91675 230.987 12.671 239.45 21.1336C247.912 29.5961 252.667 41.0739 252.667 53.0418V189.417H10.3334V53.0418ZM10.3334 265.958V220.833H252.667V265.958C252.667 277.926 247.912 289.404 239.45 297.867C230.987 306.329 219.51 311.083 207.542 311.083H55.4584C43.4905 311.083 32.0128 306.329 23.5502 297.867C15.0876 289.404 10.3334 277.926 10.3334 265.958ZM146.708 250.25C142.542 250.25 138.547 251.905 135.601 254.851C132.655 257.797 131 261.792 131 265.958C131 270.125 132.655 274.12 135.601 277.066C138.547 280.012 142.542 281.667 146.708 281.667H192.333C196.499 281.667 200.495 280.012 203.441 277.066C206.387 274.12 208.042 270.125 208.042 265.958C208.042 261.792 206.387 257.797 203.441 254.851C200.495 251.905 196.499 250.25 192.333 250.25H146.708Z" />
            </motion.svg>
            
        case 'settings':
            return <motion.svg {...remaining} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                <motion.path {...remaining} d="M9.96478,2.80881 C9.59589,2.54328 9.07558,2.4191 8.56387,2.60633 C7.4666,3.0078 6.46004,3.59559 5.5823,4.3308 C5.16522,4.68015 5.01268,5.19204 5.05794,5.64391 C5.13333,6.39671 5.00046,7.12356 4.63874,7.75007 C4.27685,8.37689 3.71344,8.85555 3.02334,9.16664 C2.60859,9.35361 2.24074,9.74273 2.14751,10.2801 C2.05047,10.8396 2,11.4143 2,12.0001 C2,12.5858 2.05047,13.1606 2.14752,13.72 C2.24075,14.2574 2.6086,14.6465 3.02335,14.8335 C3.71344,15.1446 4.27685,15.6233 4.63874,16.2501 C5.00045,16.8766 5.13332,17.6034 5.05794,18.3562 C5.01269,18.8081 5.16523,19.32 5.5823,19.6693 C6.46002,20.4045 7.46655,20.9923 8.56378,21.3937 C9.07552,21.581 9.59585,21.4568 9.96474,21.1912 C10.5794,20.7488 11.2759,20.5 12,20.5 C12.7241,20.5 13.4206,20.7488 14.0353,21.1912 C14.4042,21.4568 14.9245,21.581 15.4362,21.3937 C16.5334,20.9923 17.5399,20.4045 18.4176,19.6694 C18.8347,19.32 18.9872,18.8081 18.942,18.3562 C18.8666,17.6034 18.9994,16.8766 19.3611,16.2501 C19.723,15.6233 20.2865,15.1446 20.9766,14.8335 C21.3914,14.6465 21.7593,14.2574 21.8525,13.72 C21.9495,13.1606 22,12.5858 22,12.0001 C22,11.4144 21.9495,10.8397 21.8525,10.2803 C21.7593,9.74288 21.3914,9.35374 20.9766,9.16678 C20.2865,8.85569 19.723,8.37702 19.3611,7.7502 C18.9994,7.12366 18.8666,6.39677 18.942,5.64392 C18.9873,5.19202 18.8347,4.6801 18.4176,4.33073 C17.5399,3.59556 16.5334,3.00779 15.4361,2.60633 C14.9244,2.41911 14.4041,2.54328 14.0352,2.80881 C13.4206,3.25123 12.7241,3.50003 12,3.50003 C11.2759,3.50003 10.5794,3.25123 9.96478,2.80881 Z M9,12 C9,10.3431 10.3431,9 12,9 C13.6569,9 15,10.3431 15,12 C15,13.6569 13.6569,15 12,15 C10.3431,15 9,13.6569 9,12 Z" />
            </motion.svg>
            
        case 'search':
            return <motion.svg {...remaining} style={style} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6667 26.6667L21.0711 21.0711C21.0711 21.0711 18.6667 24 14 24C8.47715 24 4 19.5228 4 14C4 8.47715 8.47715 4 14 4C19.5228 4 24 8.47715 24 14C24 14.6849 23.9312 15.3537 23.8 16" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'file':
            return <motion.svg {...remaining} style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.53 9L13 3.47C12.8595 3.32931 12.6688 3.25018 12.47 3.25H8C7.27065 3.25 6.57118 3.53973 6.05546 4.05546C5.53973 4.57118 5.25 5.27065 5.25 6V18C5.25 18.7293 5.53973 19.4288 6.05546 19.9445C6.57118 20.4603 7.27065 20.75 8 20.75H16C16.7293 20.75 17.4288 20.4603 17.9445 19.9445C18.4603 19.4288 18.75 18.7293 18.75 18V9.5C18.7421 9.3116 18.6636 9.13309 18.53 9ZM13.25 5.81L16.19 8.75H13.25V5.81ZM16 19.25H8C7.66848 19.25 7.35054 19.1183 7.11612 18.8839C6.8817 18.6495 6.75 18.3315 6.75 18V6C6.75 5.66848 6.8817 5.35054 7.11612 5.11612C7.35054 4.8817 7.66848 4.75 8 4.75H11.75V9.5C11.7526 9.69811 11.8324 9.88737 11.9725 10.0275C12.1126 10.1676 12.3019 10.2474 12.5 10.25H17.25V18C17.25 18.3315 17.1183 18.6495 16.8839 18.8839C16.6495 19.1183 16.3315 19.25 16 19.25Z" />
            </motion.svg>

        case 'copy-clipboard':
            return <motion.svg {...remaining} style={style} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 9.75C9 10.1478 8.84196 10.5294 8.56066 10.8107C8.27936 11.092 7.89782 11.25 7.5 11.25H2.25C1.85218 11.25 1.47064 11.092 1.18934 10.8107C0.908035 10.5294 0.75 10.1478 0.75 9.75V4.5C0.75 4.10218 0.908035 3.72064 1.18934 3.43934C1.47064 3.15804 1.85218 3 2.25 3V3.75C2.05109 3.75 1.86032 3.82902 1.71967 3.96967C1.57902 4.11032 1.5 4.30109 1.5 4.5V9.75C1.5 9.94891 1.57902 10.1397 1.71967 10.2803C1.86032 10.421 2.05109 10.5 2.25 10.5H7.5C7.69891 10.5 7.88968 10.421 8.03033 10.2803C8.17098 10.1397 8.25 9.94891 8.25 9.75H9Z" />
                <path d="M4.5 1.5C4.30109 1.5 4.11032 1.57902 3.96967 1.71967C3.82902 1.86032 3.75 2.05109 3.75 2.25V7.5C3.75 7.69891 3.82902 7.88968 3.96967 8.03033C4.11032 8.17098 4.30109 8.25 4.5 8.25H9.75C9.94891 8.25 10.1397 8.17098 10.2803 8.03033C10.421 7.88968 10.5 7.69891 10.5 7.5V2.25C10.5 2.05109 10.421 1.86032 10.2803 1.71967C10.1397 1.57902 9.94891 1.5 9.75 1.5H4.5ZM4.5 0.75H9.75C10.1478 0.75 10.5294 0.908035 10.8107 1.18934C11.092 1.47064 11.25 1.85218 11.25 2.25V7.5C11.25 7.89782 11.092 8.27936 10.8107 8.56066C10.5294 8.84196 10.1478 9 9.75 9H4.5C4.10218 9 3.72064 8.84196 3.43934 8.56066C3.15804 8.27936 3 7.89782 3 7.5V2.25C3 1.85218 3.15804 1.47064 3.43934 1.18934C3.72064 0.908035 4.10218 0.75 4.5 0.75Z" />
            </motion.svg>

        case 'arrow-right':
            return <motion.svg {...remaining} style={style} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 6L8 3.5M10.5 6L8 8.5M10.5 6L1.5 6" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'arrow-left':
            return <motion.svg {...remaining} transform='rotate(180, 0, 0)' style={style} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 6L8 3.5M10.5 6L8 8.5M10.5 6L1.5 6" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'add': 
            return <motion.svg {...remaining} style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12H18" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V6" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'cross':
            return <motion.svg {...remaining} style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8L8 16M8.00001 8L16 16" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'pause':
            return <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/>
            </motion.svg>
        
        case 'play':
            return <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
            </motion.svg>

        case 'grid':
            return <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" version="1.1">
                <path d="M30 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2zM30 20h-10v10h10v-10zM30 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.104-0.895 2-2 2zM30 2h-10v10h10v-10zM12 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.105-0.896 2-2 2zM12 20h-10v10h10v-10zM12 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.104-0.896 2-2 2zM12 2h-10v10h10v-10z"/>
            </motion.svg>

        case 'list':
            return <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M6 4C4.89543 4 4 4.89543 4 6V9C4 10.1046 4.89543 11 6 11H9C10.1046 11 11 10.1046 11 9V6C11 4.89543 10.1046 4 9 4H6ZM6 6H9V9H6V6ZM14 6C13.4477 6 13 6.44772 13 7C13 7.55228 13.4477 8 14 8H19C19.5523 8 20 7.55228 20 7C20 6.44772 19.5523 6 19 6H14ZM14 15C13.4477 15 13 15.4477 13 16C13 16.5523 13.4477 17 14 17H19C19.5523 17 20 16.5523 20 16C20 15.4477 19.5523 15 19 15H14ZM4 15C4 13.8954 4.89543 13 6 13H9C10.1046 13 11 13.8954 11 15V18C11 19.1046 10.1046 20 9 20H6C4.89543 20 4 19.1046 4 18V15ZM9 15H6V18H9V15Z" />
            </motion.svg>

        case 'dots-vertical':
            return  <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

        case 'arrow-head-right':
            return <motion.svg {...remaining} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z"/>
            </motion.svg>

        case 'ether':
            return <motion.svg width={width} height={height} {...remaining} xmlns="http://www.w3.org/2000/svg" ariaLabel="Ethereum" role="img" viewBox="0 0 512 512">
                <path fill="#3C3C3B" d="m256 362v107l131-185z"/>
                <path fill="#343434" d="m256 41l131 218-131 78-132-78"/>
                <path fill="#8C8C8C" d="m256 41v158l-132 60m0 25l132 78v107"/>
                <path fill="#141414" d="m256 199v138l131-78"/>
                <path fill="#393939" d="m124 259l132-60v138"/>
            </motion.svg>

        case 'matic':
            return <motion.svg xmlns="http://www.w3.org/2000/svg" {...remaining} width={width} height={height} viewBox="0 0 32 32">
                <g fill="none">
                    <circle fill="#6F41D8" cx="16" cy="16" r="16"/>
                    <path d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.653a1.16 1.16 0 00-.627-1.042l-4.17-2.372c-.369-.216-.848-.216-1.254 0l-4.244 2.372A1.16 1.16 0 006 11.076v4.78c0 .432.221.827.627 1.043l4.244 2.372c.369.215.849.215 1.254 0l2.879-1.618 1.955-1.114 2.879-1.617c.369-.216.848-.216 1.254 0l2.251 1.258c.37.215.627.61.627 1.042v2.552c0 .431-.22.826-.627 1.042l-2.25 1.294c-.37.216-.85.216-1.255 0l-2.251-1.258c-.37-.216-.628-.611-.628-1.042v-1.654l-1.955 1.115v1.653c0 .431.221.827.627 1.042l4.244 2.372c.369.216.848.216 1.254 0l4.244-2.372c.369-.215.627-.61.627-1.042v-4.78a1.16 1.16 0 00-.627-1.042l-4.28-2.409z" fill="#FFF"/>
                </g>
            </motion.svg>

        case 'arbitrum':
            return <motion.svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 2500 2500" xmlSpace="preserve">
                <g id="Layer_x0020_1">
                    <g id="_2405588477232">
                        <g>
                            <g>
                                <path style={{ fill: '#213147' }} d="M226,760v980c0,63,33,120,88,152l849,490c54,31,121,31,175,0l849-490c54-31,88-89,88-152V760      c0-63-33-120-88-152l-849-490c-54-31-121-31-175,0L314,608c-54,31-87,89-87,152H226z"/>
                                <g>
                                    <g>
                                        <g>
                                            <path style={{ fill: '#12AAFF' }} d="M1435,1440l-121,332c-3,9-3,19,0,29l208,571l241-139l-289-793C1467,1422,1442,1422,1435,1440z"/>
                                        </g>
                                        <g>
                                            <path style={{ fill: '#12AAFF' }} d="M1678,882c-7-18-32-18-39,0l-121,332c-3,9-3,19,0,29l341,935l241-139L1678,883V882z"/>
                                        </g>
                                    </g>
                                </g>
                                <g>
                                    <path style={{ fill: '#9DCCED' }} d="M1250,155c6,0,12,2,17,5l918,530c11,6,17,18,17,30v1060c0,12-7,24-17,30l-918,530c-5,3-11,5-17,5       s-12-2-17-5l-918-530c-11-6-17-18-17-30V719c0-12,7-24,17-30l918-530c5-3,11-5,17-5l0,0V155z M1250,0c-33,0-65,8-95,25L237,555       c-59,34-95,96-95,164v1060c0,68,36,130,95,164l918,530c29,17,62,25,95,25s65-8,95-25l918-530c59-34,95-96,95-164V719       c0-68-36-130-95-164L1344,25c-29-17-62-25-95-25l0,0H1250z"/>
                                </g>

                                <polygon style={{ fill: '#213147' }} points="642,2179 727,1947 897,2088 738,2234     "/>
                                
                                <g>
                                    <path style={{ fill: '#FFFFFF' }} d="M1172,644H939c-17,0-33,11-39,27L401,2039l241,139l550-1507c5-14-5-28-19-28L1172,644z"/>
                                    <path style={{ fill: '#FFFFFF' }} d="M1580,644h-233c-17,0-33,11-39,27L738,2233l241,139l620-1701c5-14-5-28-19-28V644z"/>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </motion.svg>

        case 'wallet':
            return <motion.svg style={style} {...remaining} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet">
                <path className="clr-i-outline clr-i-outline-path-1" d="M32,15H31V9a1,1,0,0,0-1-1H6a1,1,0,0,1-1-.82V6.82A1,1,0,0,1,6,6H29.58a1,1,0,0,0,0-2H6A3,3,0,0,0,3,7a3.08,3.08,0,0,0,0,.36V27.93A4.1,4.1,0,0,0,7.13,32H30a1,1,0,0,0,1-1V25h1a1,1,0,0,0,1-1V16A1,1,0,0,0,32,15ZM29,30H7.13A2.11,2.11,0,0,1,5,27.93V9.88A3.11,3.11,0,0,0,6,10H29v5H22a5,5,0,0,0,0,10h7Zm2-7H22a3,3,0,0,1,0-6H31Z"/><circle className="clr-i-outline clr-i-outline-path-2" cx="23.01" cy="20" r="1.5"/>
            </motion.svg>

        case 'create-folder':
            return <motion.svg style={style} {...remaining} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.0601 16.5V11.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.5 14H9.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z" strokeMiterlimit="10"/>
            </motion.svg>

        case 'minimize':
            return <motion.svg {...remaining} style={style} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 20l10 10 10-10z"/>
                <path d="M0 0h48v48h-48z" fill="none"/>
            </motion.svg>
        
        case 'maximize':
            return <motion.svg {...remaining} style={style} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 28l10-10 10 10z"/>
                <path d="M0 0h48v48h-48z" fill="none"/>
            </motion.svg>
    }
}