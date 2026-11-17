import DownloadUploadsZip from './DownloadUploadsZip';
import DeleteUploads from './DeleteUploads'; // 👈 1. Importas el componente

function ManageFiles() {
    return (
        <div>
            {/* Componente de descarga */}
            <DownloadUploadsZip />

            {/* 👈 2. Pegas el componente de borrado aquí mismo */}
            <DeleteUploads />
        </div>
    );
}

export default ManageFiles;